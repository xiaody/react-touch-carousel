import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import data from "../data.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel, {clamp} from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const cardSize = 300;
const cardPadCount = 3;
const carouselWidth = clamp(window.innerWidth, 0, 960);
function CarouselContainer(props) {
  const {cursor, carouselState, ...rest} = props;
  const translateX = (cursor - cardPadCount) * cardSize + (carouselWidth - cardSize) / 2;
  return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-container"
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    style: {transform: `translate3d(${translateX}px, 0, 0)`},
    ...rest
  }));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  renderCard(index, modIndex, cursor) {
    const item = data[modIndex];
    const rotate = 40 * (index + cursor);
    const onTop = Math.abs(index + cursor) < 0.5;
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: "carousel-card"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-card-inner",
      style: {
        backgroundColor: item.background,
        transform: `rotate(${rotate}deg)`,
        zIndex: onTop ? 1 : 0
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
      renderCard: this.renderCard
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
});
