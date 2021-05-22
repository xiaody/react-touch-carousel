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
  const translateY = (cursor - cardPadCount) * cardSize;
  return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-container"
  }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
    className: "carousel-track",
    style: {transform: `translate3d(0, ${translateY}px, 0)`},
    ...rest
  }));
}
const Container = touchWithMouseHOC(CarouselContainer);
class App extends Component {
  renderCard(index, modIndex) {
    const item = data[modIndex];
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: "carousel-card",
      "data-index": index,
      "data-mod-index": modIndex
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
      autoplay: 3e3,
      vertical: true,
      renderCard: this.renderCard
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
});
