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

const distance = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

export default function touchWithMouseHOC (Component, options = {}) {
  const clickTolerance = options.clickTolerance || 5

  class TouchWithMouse extends React.Component {
    constructor (props) {
      super(props)
      this.isMouseDown = false
      this.mouseDownId = 0
      this.lastMoveEvent = null
      this.clickStartX = null
      this.clickStartY = null
    }

    componentDidMount () {
      document.addEventListener('mousemove', this.onDocumentMouseMove)
      document.addEventListener('mouseup', this.onDocumentMouseUp)
      // Listen in the capture phase, so we can prevent the clicks
      document.addEventListener('click', this.onDocumentClick, true)
      window.addEventListener('blur', this.onWindowBlur)
    }

    componentWillUnmount () {
      document.removeEventListener('mousemove', this.onDocumentMouseMove)
      document.removeEventListener('mouseup', this.onDocumentMouseUp)
      document.removeEventListener('click', this.onDocumentClick, true)
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
      this.clickStartX = e.pageX
      this.clickStartY = e.pageY
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
      // This waits for the click event, so we know to prevent it
      setTimeout(() => {
        this.clickStartX = null
        this.clickStartY = null
      }, 0)
    }

    onWindowBlur = (e) => {
      if (!this.isMouseDown) {
        return
      }
      this.isMouseDown = false
      this.clickStartX = null
      this.clickStartY = null
      const mockTouchCancelEvent = this.mockTouchEvent(
        e,
        {
          changedTouches: this.lastMoveEvent.changedTouches
        }
      )
      this.props.onTouchCancel(mockTouchCancelEvent)
    }

    onDocumentClick = (e) => {
      if (this.clickStartX !== null && this.clickStartY !== null && distance(this.clickStartX, this.clickStartY, e.pageX, e.pageY) > clickTolerance) {
        this.clickStartX = null
        this.clickStartY = null
        e.preventDefault()
        e.stopPropagation()
      }
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
