import React from 'react'
import {Motion, spring} from 'react-motion'
import {
  range, clamp, precision as calcPrecision,
  getTouchPosition, getTouchId, omit
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
  moveScale: 1,
  stiffness: 200,
  damping: 25,
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
      moding: false
    }
    this.usedCursor = 0
    this.touchCount = 0
    this.touchMoves = []
    this.autoplayTimer = null
    this.grabbing = false
    this.tracingTouchId = null
    this.touchMoveDirection = null
  }

  componentDidMount () {
    this.autoplayIfEnabled()
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
    this.touchMoveDirection = null
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
    if (touchId !== this.tracingTouchId) {
      this.touchMoves = [touchMove]
    }
    this.tracingTouchId = touchId

    let shouldIgnore = false
    if (this.props.ignoreCrossMove && this.state.active && this.touchMoves.length) {
      const {vertical} = this.props
      const touchMoveDirection = this.touchMoveDirection = this.touchMoveDirection || (
        Math.abs(touchMove.y - this.touchMoves[0].y) > Math.abs(touchMove.x - this.touchMoves[0].x)
          ? 'vertical'
          : 'horizontal'
      )
      shouldIgnore = (touchMoveDirection === 'vertical' && !vertical) ||
        (touchMoveDirection === 'horizontal' && vertical)
    }

    if (shouldIgnore) {
      return
    }

    // Prevent the default action i.e. page scroll.
    // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
    // please use CSS `touch-action` for it.
    e.preventDefault()

    const {cardSize, moveScale, vertical} = this.props
    const lastMove = this.touchMoves[this.touchMoves.length - 1]
    const xy = vertical ? 'y' : 'x'
    const distance = touchMove[xy] - lastMove[xy]
    this.setState({dragging: true})
    this.setCursor(this.state.cursor + distance / cardSize * moveScale, true)

    this.touchMoves.push(touchMove)
    if (this.touchMoves.length > 250) {
      this.touchMoves.splice(0, 50)
    }
  }

  onTouchEnd = (e) => {
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

    // Due to multi-touch, records can be empty even if .dragging is true.
    // So check both.
    if (this.state.dragging && this.touchMoves.length) {
      const {cardSize, moveScale, vertical} = this.props
      const damping = this.props.damping / 1e6
      const {touchMoves} = this
      let i = touchMoves.length
      let duration = 0
      while (--i >= 0 && duration < 100) {
        duration = Date.now() - touchMoves[i].time
      }
      i++
      const xy = vertical ? 'y' : 'x'
      const touchMoveVelocity = (getTouchPosition(e)[xy] - touchMoves[i][xy]) / duration
      const momentumDistance = touchMoveVelocity * Math.abs(touchMoveVelocity) / damping / 2
      const {cursor} = this.state
      const cursorDelta = clamp(
        momentumDistance / cardSize * moveScale,
        Math.floor(cursor) - cursor,
        Math.ceil(cursor) - cursor
      )
      this.setCursor(Math.round(cursor + cursorDelta))
      this.touchMoves = []
    } else {
      // User grabs and then releases without any move in between.
      // Snap the cursor.
      this.setCursor(Math.round(this.state.cursor))
    }
    this.setState({active: false, dragging: false})
    this.tracingTouchId = null
    this.autoplayIfEnabled()
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
    return new Promise(resolve => {
      this.setState({cursor}, resolve)
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

  modeAs = (cursor) => {
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
      let newCursor = cursor
      while (newCursor > 0) {
        newCursor -= cardCount
      }
      while (newCursor < 1 - cardCount) {
        newCursor += cardCount
      }
      if (newCursor !== cursor) {
        this.modeAs(newCursor).then(resolve)
      } else {
        resolve()
      }
    })
  }

  render () {
    const {
      component: Component,
      cardSize, cardCount,
      cardPadCount, renderCard,
      stiffness, damping, precision,
      loop,
      ...rest
    } = this.props
    const {active, dragging, moding} = this.state
    const padCount = loop ? cardPadCount : 0
    const springConfig = {stiffness, damping, precision}
    const computedCursor = this.getComputedCursor()

    return (
      <Motion
        defaultStyle={{cursor: computedCursor}}
        style={{
          cursor: (dragging || moding)
            ? calcPrecision(computedCursor, precision)
            : spring(computedCursor, springConfig)
        }}
      >
        {({cursor}) => {
          this.usedCursor = cursor
          return (
            <Component
              {...omit(rest, propsKeys)}
              cursor={cursor}
              active={active}
              dragging={dragging}
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
            >
              {range(0 - padCount, cardCount - 1 + padCount).map(index => {
                let modIndex = index % cardCount
                while (modIndex < 0) {
                  modIndex += cardCount
                }
                return renderCard(index, modIndex, cursor)
              })}
            </Component>
          )
        }}
      </Motion>
    )
  }
}

TouchCarousel.defaultProps = defaultProps

export default TouchCarousel
