import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import data from "../data.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel, {clamp} from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const cardSize = 300;
const cardPadCount = 2;
function CarouselContainer(props) {
  const {cursor, carouselState, ...rest} = props;
  return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-container"
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    ...rest
  }));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  renderCard(index, modIndex, cursor) {
    const item = data[modIndex];
    const opacity = 1 - 1.5 * Math.abs(index + cursor);
    const zIndex = opacity * data.length;
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: "carousel-card",
      style: {
        opacity: clamp(opacity, 0, 1),
        zIndex
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-card-inner",
      style: {
        backgroundColor: item.background
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-title"
    }, item.title), /* @__PURE__ */ React.createElement("div", {
      className: "carousel-text"
    }, item.text)));
  }
  render() {
    return /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(TouchCarousel, {
      component: Container,
      cardSize,
      cardCount: data.length,
      cardPadCount,
      autoplay: 2e3,
      renderCard: this.renderCard,
      stiffness: 100
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
});
