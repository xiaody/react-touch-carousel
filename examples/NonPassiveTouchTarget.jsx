/*
 * For nasty iOS Safari.
 * Since iOS Safari 11.3+, all touchmove listeners are passive by default.
 * Yet it doesn't fully support CSS touch-action like Chrome does.
 * So here is a component to workaround.
 *
 * What is more weird is that **sometimes** even a non-passive listener cannot
 * preventDefault. You have to nest this component inside another instance
 * of it like:
 * <NonPassiveTouchTarget>
 *   <NonPassiveTouchTarget onTouchMove={fnYourListener} />
 * </NonPassiveTouchTarget>
 */
import React from 'react'

const OPTIONS = { passive: false }

class NonPassiveTouchTarget extends React.Component {
  componentDidMount () {
    this.node.addEventListener('touchmove', this.props.onTouchMove, OPTIONS)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onTouchMove !== this.props.onTouchMove) {
      this.node.removeEventListener('touchmove', prevProps.onTouchMove, OPTIONS)
      this.node.addEventListener('touchmove', this.props.onTouchMove, OPTIONS)
    }
  }

  componentWillUnmount () {
    this.node.removeEventListener('touchmove', this.props.onTouchMove, OPTIONS)
  }

  ref = (node) => {
    this.node = node
  }

  render () {
    const { component: Component, onTouchMove, ...rest } = this.props
    return (
      <Component
        ref={this.ref}
        {...rest}
      />
    )
  }
}

NonPassiveTouchTarget.defaultProps = {
  component: 'div',
  onTouchMove () {}
}

export default NonPassiveTouchTarget
