import React from 'react'
import {Motion, spring} from 'react-motion'
import {
  range, clamp, precision as calcPrecision,
  getTouchPosition, getTouchId
} from './utils'

function TouchMoveRecord (e) {
  const {x, y} = getTouchPosition(e)
  this.x = x
  this.y = y
  this.time = Date.now()
}

class TouchCarousel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      cursor: 0,
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
    this.tracingTouchId = getTouchId(e)
    this.stopAutoplay()
    this.touchMoves = []
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
    // Prevent the default action i.e. page scroll.
    // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
    // please use CSS `touch-action` for it.
    e.preventDefault()
    this.grabbing = false

    const touchId = getTouchId(e)
    if (touchId !== this.tracingTouchId) {
      this.touchMoves = []
    }
    this.tracingTouchId = touchId

    const touchMove = new TouchMoveRecord(e)
    if (this.state.active && this.touchMoves.length) {
      const {cardSize, moveScale, vertical} = this.props
      const lastMove = this.touchMoves[this.touchMoves.length - 1]
      const xy = vertical ? 'y' : 'x'
      const distance = touchMove[xy] - lastMove[xy]
      this.setState({dragging: true})
      this.setCursor(this.state.cursor + distance / cardSize * moveScale, true)
    }
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

  next = () => {
    this.modCursor().then(() => {
      this.setCursor(this.state.cursor - 1)
    })
  }

  setCursor = (cursor) => {
    return new Promise(resolve => {
      this.setState({cursor}, resolve)
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
        this.setState({moding: true, cursor: newCursor}, () => {
          this.setState({moding: false}, resolve)
        })
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
      stiffness, damping, precision, maxOverflow,
      loop, moveScale, autoplay, vertical, clickTolerance,
      ...rest
    } = this.props
    const {cursor, active, dragging, moding} = this.state
    const padCount = loop ? cardPadCount : 0
    const springConfig = {stiffness, damping, precision}

    let computedCursor = cursor
    if (!this.props.loop) {
      computedCursor = clamp(computedCursor, 1 - cardCount, 0)
      if (dragging && cursor > 0) {
        computedCursor = maxOverflow - maxOverflow / (cursor + 1)
      } else if (dragging && cursor < 1 - cardCount) {
        computedCursor = 1 - cardCount - maxOverflow + maxOverflow / (1 - cardCount - cursor + 1)
      }
    }

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
              {...rest}
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

TouchCarousel.defaultProps = {
  component: 'div',
  cardSize: global.innerWidth || 320,
  cardCount: 1,
  cardPadCount: 2,
  loop: true,
  autoplay: 0,
  vertical: false,
  renderCard () {},
  precision: 0.001,
  moveScale: 1,
  stiffness: 200,
  damping: 25,
  maxOverflow: 0.33,
  clickTolerance: 2
}

export default TouchCarousel
