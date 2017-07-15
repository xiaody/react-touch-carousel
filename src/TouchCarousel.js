import React from 'react'
import {Motion, spring} from 'react-motion'
import {range, clamp, precision, getTouchPosition} from './utils'

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
  }

  componentDidMount () {
    this.autoplayIfEnabled()
  }

  componentWillUnmount () {
    this.stopAutoplay()
  }

  onTouchStart = () => {
    this.touchCount++
    this.setState({active: true})
    this.stopAutoplay()
    this.touchMoves = []
    // When user grabs the scroll, cancel the spring effect.
    this.setCursor(this.usedCursor)
      .then(this.modCursor)
  }

  onTouchMove = (e) => {
    // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
    // please use CSS `touch-action` for it.
    e.preventDefault()

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
    this.touchCount--
    if (this.touchCount > 0) {
      return
    }
    if (this.state.dragging) {
      const {cardSize, moveScale, vertical} = this.props
      const damping = this.props.damping / 1e3
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
    } else {
      // User grabs and then releases without any move in between.
      // Snap the cursor.
      this.setCursor(Math.round(this.state.cursor))
    }
    this.setState({active: false, dragging: false})
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

  setCursor = (cursor, allowOverScroll) => {
    cursor = precision(cursor, this.props.precision)
    let used = cursor
    if (!this.props.loop) {
      used = clamp(cursor, 1 - this.props.cardCount, 0)
    }
    if (allowOverScroll && cursor !== used) {
      if (cursor > used) {
        used += 1 - 1 / (cursor - used + 1)
      } else {
        used -= 1 - 1 / (used - cursor + 1)
      }
    }
    return new Promise(resolve => {
      this.setState({cursor: used}, resolve)
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
      loop, moveScale, damping, autoplay, vertical, precision,
      ...rest
    } = this.props
    const {cursor, active, dragging, moding} = this.state
    const padCount = loop ? cardPadCount : 0
    return (
      <Motion
        defaultStyle={{cursor}}
        style={{cursor: (dragging || moding) ? cursor : spring(cursor)}}
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
  precision: 0.0001,
  moveScale: 1,
  damping: 1
}

export default TouchCarousel
