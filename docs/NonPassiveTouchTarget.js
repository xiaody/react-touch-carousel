var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import React from "./_snowpack/pkg/react.js";
const OPTIONS = {passive: false};
class NonPassiveTouchTarget extends React.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "ref", (node) => {
      this.node = node;
    });
  }
  componentDidMount() {
    this.node.addEventListener("touchmove", this.props.onTouchMove, OPTIONS);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.onTouchMove !== this.props.onTouchMove) {
      this.node.removeEventListener("touchmove", prevProps.onTouchMove, OPTIONS);
      this.node.addEventListener("touchmove", this.props.onTouchMove, OPTIONS);
    }
  }
  componentWillUnmount() {
    this.node.removeEventListener("touchmove", this.props.onTouchMove, OPTIONS);
  }
  render() {
    const {component: Component, onTouchMove, ...rest} = this.props;
    return /* @__PURE__ */ React.createElement(Component, {
      ref: this.ref,
      ...rest
    });
  }
}
NonPassiveTouchTarget.defaultProps = {
  component: "div",
  onTouchMove() {
  }
};
export default NonPassiveTouchTarget;
