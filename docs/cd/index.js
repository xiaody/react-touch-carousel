var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import cx from "../_snowpack/pkg/classnames.js";
import data from "../data.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel, {clamp} from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const cardSize = 300;
const cardPadCount = 3;
const carouselWidth = clamp(window.innerWidth, 0, 960);
function CarouselContainer(props) {
  const {cursor, carouselState: {dragging, springing}, ...rest} = props;
  const translateX = (cursor - cardPadCount) * cardSize + (carouselWidth - cardSize) / 2;
  return /* @__PURE__ */ React.createElement("div", {
    className: cx("cd-player", {
      "is-dragging": dragging,
      "is-springing": springing
    })
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-container"
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    style: {transform: `translate3d(${translateX}px, 0, 0)`},
    ...rest
  })), /* @__PURE__ */ React.createElement("div", {
    className: "cd-bar"
  }));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "onRest", (index, modIndex) => {
      this.setState({playing: modIndex});
    });
    __publicField(this, "renderCard", (index, modIndex, cursor) => {
      const item = data[modIndex];
      const playing = this.state.playing === modIndex;
      return /* @__PURE__ */ React.createElement("div", {
        key: index,
        className: cx("carousel-card", {playing})
      }, /* @__PURE__ */ React.createElement("div", {
        className: "carousel-card-inner"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "carousel-title",
        style: {backgroundColor: item.background}
      }, "CD ", modIndex + 1)));
    });
    this.state = {
      playing: 0
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(TouchCarousel, {
      component: Container,
      cardSize,
      cardCount: data.length,
      cardPadCount,
      loop: true,
      autoplay: 5e3,
      renderCard: this.renderCard,
      onRest: this.onRest,
      "data-playing": this.state.playing
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
  if (/iPhone|iPad/.test(navigator.userAgent)) {
    document.getElementById("iOS-bug").removeAttribute("hidden");
  }
});
