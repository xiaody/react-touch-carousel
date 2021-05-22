import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import data from "../data.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const cardSize = 300;
const cardPadCount = 2;
function CarouselContainer(props) {
  const {cursor, carouselState, ...rest} = props;
  return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-container"
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    "data-cursor": cursor,
    ...rest
  }));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  renderCard(index, modIndex, cursor) {
    cursor = -cursor;
    const item = data[modIndex];
    const translateCard = index > cursor ? 100 * (index - cursor) : 0;
    const translateText = index < cursor ? 5 * (index - cursor) : 0;
    const translateTitle = translateText * 1.2;
    const scaleTitle = index < cursor ? 1 - 0.1 * (cursor - index) : 1;
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: "carousel-card",
      style: {transform: `translate3d(${translateCard}%, 0, 0)`},
      "data-index": index,
      "data-mod-index": modIndex
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-card-inner",
      style: {
        backgroundColor: item.background
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "carousel-title",
      style: {transform: `scale(${scaleTitle}) translate3d(${translateTitle}%, 0, 0)`}
    }, item.title), /* @__PURE__ */ React.createElement("div", {
      className: "carousel-text",
      style: {transform: `translate3d(${translateText}%, 0, 0)`}
    }, item.text)));
  }
  render() {
    return /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(TouchCarousel, {
      component: Container,
      cardSize,
      cardCount: data.length,
      cardPadCount,
      autoplay: 3e3,
      renderCard: this.renderCard
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
});
