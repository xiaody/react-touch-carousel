import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import cx from "../_snowpack/pkg/classnames.js";
import data from "../data.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel, {clamp} from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const query = window.location.search.slice(1);
const enableLoop = /\bloop\b/.test(query);
const enableAutoplay = /\bautoplay\b/.test(query);
const cardSize = 300;
const cardPadCount = enableLoop ? 3 : 0;
const carouselWidth = clamp(window.innerWidth, 0, 960);
function log(text) {
  document.getElementById("console").innerText = text;
}
function CarouselContainer(props) {
  const {cursor, carouselState: {active, dragging}, ...rest} = props;
  let current = -Math.round(cursor) % data.length;
  while (current < 0) {
    current += data.length;
  }
  const translateX = (cursor - cardPadCount) * cardSize + (carouselWidth - cardSize) / 2;
  return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: cx("carousel-container", {
      "is-active": active,
      "is-dragging": dragging
    })
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    style: {transform: `translate3d(${translateX}px, 0, 0)`},
    ...rest
  }), /* @__PURE__ */ React.createElement("div", {
    className: "carousel-pagination-wrapper"
  }, /* @__PURE__ */ React.createElement("ol", {
    className: "carousel-pagination"
  }, data.map((_, index) => /* @__PURE__ */ React.createElement("li", {
    key: index,
    className: current === index ? "current" : ""
  })))));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  renderCard(index, modIndex) {
    const item = data[modIndex];
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: "carousel-card",
      onClick: () => log(`clicked card ${1 + modIndex}`)
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-card-inner",
      style: {backgroundColor: item.background}
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
      loop: enableLoop,
      autoplay: enableAutoplay ? 2e3 : false,
      renderCard: this.renderCard,
      onRest: (index) => log(`rest at index ${index}`),
      onDragStart: () => log("dragStart"),
      onDragEnd: () => log("dragEnd"),
      onDragCancel: () => log("dragCancel")
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
  const optionExplain = [];
  if (enableLoop) {
    optionExplain.push("loop");
  }
  if (enableAutoplay) {
    optionExplain.push("autoplay=2000");
  }
  if (optionExplain.length) {
    document.getElementById("option-explain").textContent = optionExplain.join(" ");
  }
});
