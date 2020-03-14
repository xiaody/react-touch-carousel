import React from 'react'
import {Spring} from 'react-spring/renderprops'
import {
  range, clamp, getTouchPosition,
  getTouchId, omit, modCursor
} from './utils'

function TouchMoveRecord (e) {
  const {x, y} = getTouchPosition(e)
  this.x = x
  this.y = y
  this.time = Date.now()
}

const defaultProps = {
  component: 'div',
  cardSize: global.innerWidth || 320,
  cardCount: 1,
  cardPadCount: 2,
  defaultCursor: 0,
  loop: true,
  autoplay: 0,
  vertical: false,
  renderCard () {},
  precision: 0.001,
  tension: 200,
  friction: 25,
  moveScale: 1,
  onRest () {},
  onDragStart () {},
  onDragEnd () {},
  onDragCancel () {},
  maxOverflow: 0.5,
  clickTolerance: 2,
  ignoreCrossMove: true
}

const propsKeys = Object.keys(defaultProps)

class TouchCarousel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      cursor: props.defaultCursor,
      active: false,
      dragging: false,
      springing: false,
      moding: false
    }
    this.usedCursor = 0
    this.touchCount = 0
    this.touchMoves = []
    this.autoplayTimer = null
    this.grabbing = false
    this.tracingTouchId = null
    this.isMovingCross = null
  }

  componentDidMount () {
    this.autoplayIfEnabled()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.autoplay !== this.props.autoplay) {
      this.stopAutoplay()
      this.autoplayIfEnabled()
    }
  }

  componentWillUnmount () {
    this.stopAutoplay()
  }

  onTouchStart = (e) => {
    const oldTouchCount = this.touchCount
    this.touchCount += e.changedTouches.length
    this.setState({active: true})
    this.stopAutoplay()
    this.tracingTouchId = getTouchId(e)
    this.touchMoves = [new TouchMoveRecord(e)]
    this.isMovingCross = null
    const {cardSize, clickTolerance} = this.props
    // User click a card before it's in place but near, allow the clicking.
    // Otherwise it's only a grab.
    this.grabbing = cardSize * Math.abs(this.usedCursor - this.state.cursor) > clickTolerance
    // When user clicks or grabs the scroll, cancel the spring effect.
    if (!oldTouchCount) {
      this.setCursor(this.usedCursor)
        .then(this.modCursor)
    } else {
      this.modCursor()
    }
  }

  onTouchMove = (e) => {
    this.grabbing = false
    const touchMove = new TouchMoveRecord(e)
    const touchId = getTouchId(e)
    if (touchId !== this.tracingTouchId || !this.touchMoves.length) {
      this.touchMoves = [touchMove]
    }
    this.tracingTouchId = touchId

    let shouldIgnore = e.defaultPrevented
    if (!shouldIgnore && this.state.active) {
      if (this.isMovingCross == null) {
        const {vertical, ignoreCrossMove} = this.props
        let factor = ignoreCrossMove
        if (typeof factor !== 'number') {
          factor = factor ? 1 : 0
        }
        const mainAxis = vertical ? 'y' : 'x'
        const crossAxis = vertical ? 'x' : 'y'
        const deltMain = Math.abs(touchMove[mainAxis] - this.touchMoves[0][mainAxis])
        const deltCross = Math.abs(touchMove[crossAxis] - this.touchMoves[0][crossAxis])
        this.isMovingCross = deltCross * factor > deltMain
      }
      shouldIgnore = this.isMovingCross
    }

    if (shouldIgnore) {
      return
    }

    // Prevent the default action i.e. page scroll.
    // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
    // please use CSS `touch-action` for it.
    e.preventDefault()

    const {cardSize, moveScale, vertical, onDragStart} = this.props
    const lastMove = this.touchMoves[this.touchMoves.length - 1]
    const xy = vertical ? 'y' : 'x'
    const distance = touchMove[xy] - lastMove[xy]
    this.setState({dragging: true}, this.state.dragging ? undefined : onDragStart)
    this.setCursor(this.state.cursor + distance / cardSize * moveScale)

    this.touchMoves.push(touchMove)
    if (this.touchMoves.length > 250) {
      this.touchMoves.splice(0, 50)
    }
  }

  onTouchEndOrCancel = (e) => {
    const {type} = e
    this.touchCount -= e.changedTouches.length
    if (this.touchCount > 0) {
      this.touchMoves = []
      return
    }

    // prevent click event for grab actions
    if (this.grabbing) {
      e.preventDefault()
      e.stopPropagation()
    }

    const wasDragging = this.state.dragging
    let targetCursor = null
    // Due to multi-touch, records can be empty even if .dragging is true.
    // So check both.
    if (wasDragging && this.touchMoves.length) {
      const {cardSize, moveScale, vertical} = this.props
      const friction = this.props.friction / 1e6
      const {touchMoves} = this
      let i = touchMoves.length
      let duration = 0
      while (--i >= 0 && duration < 100) {
        duration = Date.now() - touchMoves[i].time
      }
      i++
      const xy = vertical ? 'y' : 'x'
      const touchMoveVelocity = (getTouchPosition(e)[xy] - touchMoves[i][xy]) / duration
      const momentumDistance = touchMoveVelocity * Math.abs(touchMoveVelocity) / friction / 2
      const {cursor} = this.state
      const cursorDelta = clamp(
        momentumDistance / cardSize * moveScale,
        Math.floor(cursor) - cursor,
        Math.ceil(cursor) - cursor
      )
      targetCursor = Math.round(cursor + cursorDelta)
      this.touchMoves = []
    } else {
      // User grabs and then releases without any move in between.
      // Snap the cursor.
      targetCursor = Math.round(this.state.cursor)
    }
    this.setState({active: false, dragging: false}, () => {
      this.setCursor(targetCursor)
      if (wasDragging) {
        this.props[type === 'touchend' ? 'onDragEnd' : 'onDragCancel']()
      }
    })
    this.tracingTouchId = null
    this.autoplayIfEnabled()
  }

  onSpringRest = () => {
    if (!this.shouldEnableSpring()) return
    this.setState({springing: false})
    const cursor = Math.round(this.usedCursor)
    const index = -cursor
    let modIndex = index % this.props.cardCount
    while (modIndex < 0) {
      modIndex += this.props.cardCount
    }
    this.props.onRest(index, modIndex, cursor, this.state)
  }

  autoplayIfEnabled = () => {
    if (this.props.autoplay) {
      this.autoplayTimer = setInterval(this.next, this.props.autoplay)
    }
  }

  stopAutoplay = () => {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
  }

  go = (n) => {
    return this.modCursor().then(() => {
      // n must be in range here.
      // That's why next()/prev() don't use this method.
      this.setCursor(n)
    })
  }

  next = () => {
    return this.modCursor().then(() => {
      this.setCursor(this.state.cursor - 1)
    })
  }

  prev = () => {
    return this.modCursor().then(() => {
      this.setCursor(this.state.cursor + 1)
    })
  }

  setCursor = (cursor) => {
    const springing = this.shouldEnableSpring() && cursor !== this.state.cursor
    return new Promise(resolve => {
      this.setState({cursor, springing}, resolve)
    })
  }

  getCursor () {
    return this.state.cursor
  }

  getComputedCursor () {
    const {cardCount, loop, maxOverflow} = this.props
    const {cursor, dragging} = this.state
    let computedCursor = cursor
    if (!loop) {
      computedCursor = clamp(computedCursor, 1 - cardCount, 0)
      if (dragging && cursor > 0) {
        computedCursor = maxOverflow - maxOverflow / (cursor + 1)
      } else if (dragging && cursor < 1 - cardCount) {
        computedCursor = 1 - cardCount - maxOverflow + maxOverflow / (1 - cardCount - cursor + 1)
      }
    }
    return computedCursor
  }

  getUsedCursor () {
    return this.usedCursor
  }

  modAs = (cursor) => {
    return new Promise(resolve => {
      this.setState({moding: true, cursor}, () => {
        this.setState({moding: false}, resolve)
      })
    })
  }

  modCursor = () => {
    return new Promise(resolve => {
      const {loop, cardCount} = this.props
      if (!loop) {
        return resolve()
      }
      const {cursor} = this.state
      const newCursor = modCursor(cursor, cardCount)
      if (newCursor !== cursor) {
        this.modAs(newCursor).then(resolve)
      } else {
        resolve()
      }
    })
  }

  shouldEnableSpring = () => {
    const {active, moding} = this.state
    return !active && !moding
  }

  render () {
    const {
      component: Component,
      cardSize, cardCount,
      cardPadCount, renderCard,
      tension, friction, precision,
      loop,
      ...rest
    } = this.props
    const padCount = loop ? cardPadCount : 0
    const springConfig = {tension, friction, precision}
    const computedCursor = this.getComputedCursor()

    return (
      <Spring
        config={springConfig}
        from={{cursor: computedCursor}}
        immediate={!this.shouldEnableSpring()}
        to={{cursor: computedCursor}}
        onRest={this.onSpringRest}
      >
        {({cursor}) => {
          this.usedCursor = cursor
          return (
            <Component
              {...omit(rest, propsKeys)}
              cursor={cursor}
              carouselState={this.state}
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEndOrCancel}
              onTouchCancel={this.onTouchEndOrCancel}
            >
              {range(0 - padCount, cardCount - 1 + padCount).map(index => {
                let modIndex = index % cardCount
                while (modIndex < 0) {
                  modIndex += cardCount
                }
                return renderCard(index, modIndex, cursor, this.state)
              })}
            </Component>
          )
        }}
      </Spring>
    )
  }
}

TouchCarousel.defaultProps = defaultProps

export default TouchCarousel
