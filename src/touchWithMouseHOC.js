/**
 * Mouse support. See #4.
 * Maybe worth a separate package like "react-touch-with-mouse"
 */
import React from 'react'

const mockEventTypes = {
  mousedown: 'touchstart',
  mousemove: 'touchmove',
  mouseup: 'touchend',
  blur: 'touchcancel'
}

export default function touchWithMouseHOC (Component) {
  class TouchWithMouse extends React.Component {
    constructor (props) {
      super(props)
      this.isMouseDown = false
      this.mouseDownId = 0
      this.lastMoveEvent = null
    }

    componentDidMount () {
      document.addEventListener('mousemove', this.onDocumentMouseMove)
      document.addEventListener('mouseup', this.onDocumentMouseUp)
      window.addEventListener('blur', this.onWindowBlur)
    }

    componentWillUnmount () {
      document.removeEventListener('mousemove', this.onDocumentMouseMove)
      document.removeEventListener('mouseup', this.onDocumentMouseUp)
      window.removeEventListener('blur', this.onWindowBlur)
    }

    mockTouchEvent = (e, overwrites = {}) => ({
      changedTouches: overwrites.changedTouches || [
        { identifier: this.mouseTouchId, pageX: e.pageX, pageY: e.pageY }
      ],
      type: mockEventTypes[e.type] || e.type,
      preventDefault: e.preventDefault.bind(e),
      stopPropagation: e.stopPropagation.bind(e)
    })

    onMouseDown = (e) => {
      this.props.onMouseDown(e)
      this.isMouseDown = true
      this.mouseDownId++
      this.props.onTouchStart(this.mockTouchEvent(e))
    }

    onDocumentMouseMove = (e) => {
      if (!this.isMouseDown) {
        return
      }
      this.lastMoveEvent = this.mockTouchEvent(e)
      this.props.onTouchMove(this.lastMoveEvent)
    }

    onDocumentMouseUp = (e) => {
      if (!this.isMouseDown) {
        return
      }
      this.isMouseDown = false
      this.props.onTouchEnd(this.mockTouchEvent(e))
    }

    onWindowBlur = (e) => {
      if (!this.isMouseDown) {
        return
      }
      this.isMouseDown = false
      const mockTouchCancelEvent = this.mockTouchEvent(
        e,
        {
          changedTouches: this.lastMoveEvent.changedTouches
        }
      )
      this.props.onTouchCancel(mockTouchCancelEvent)
    }

    render () {
      const {onMouseDown, ...rest} = this.props
      return (
        <Component
          {...rest}
          onMouseDown={this.onMouseDown}
        />
      )
    }
  }

  TouchWithMouse.defaultProps = {
    onMouseDown () {},
    onTouchStart () {},
    onTouchMove () {},
    onTouchEnd () {},
    onTouchCancel () {}
  }

  TouchWithMouse.displayName = `TouchWithMouse(${Component.displayName || Component.name})`

  return TouchWithMouse
}
