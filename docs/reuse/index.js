var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import React, {Component} from "../_snowpack/pkg/react.js";
import {render} from "../_snowpack/pkg/react-dom.js";
import NonPassiveTouchTarget from "../NonPassiveTouchTarget.js";
import TouchCarousel, {clamp, range} from "../src/index.js";
import touchWithMouseHOC from "../src/touchWithMouseHOC.js";
const data = range(0, 999).map((n) => ({
  title: `Card ${n}`,
  text: `This is card ${n}`
}));
const queryPage = parseInt(window.location.search.slice(1));
const startPage = queryPage ? clamp(queryPage, 0, data.length - 1) : 0;
const carouselWidth = clamp(window.innerWidth, 0, 960);
const cardSize = carouselWidth;
class App extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "modPage", () => {
      const cursor = this.carousel.getCursor();
      const {page, renderedData} = this.state;
      if (Math.round(cursor) !== cursor)
        return;
      if (page !== 0 && cursor === 0 || page !== data.length - renderedData.length && cursor === 1 - renderedData.length) {
        const newCursor = -1;
        const newPage = page - cursor + newCursor;
        this.setState({
          page: newPage,
          renderedData: this.getRenderedData(newPage)
        });
        this.carousel.modAs(newCursor);
      }
    });
    __publicField(this, "container", touchWithMouseHOC((props) => {
      const {cursor, carouselState, ...rest} = props;
      const translateX = cursor * cardSize;
      return /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
        className: "carousel-container",
        onTouchStart: this.modPage,
        onMouseDown: this.modPage
      }, /* @__PURE__ */ React.createElement(NonPassiveTouchTarget, {
        className: "carousel-track",
        style: {transform: `translate3d(${translateX}px, 0, 0)`},
        ...rest
      }));
    }));
    __publicField(this, "renderCard", (index, _, cursor) => {
      const {page} = this.state;
      const item = data[page + index];
      return /* @__PURE__ */ React.createElement("div", {
        key: index,
        className: "carousel-card"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "carousel-card-inner"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "carousel-title"
      }, item.title), /* @__PURE__ */ React.createElement("div", {
        className: "carousel-text"
      }, item.text)));
    });
    const renderedData = this.getRenderedData(startPage);
    this.state = {
      page: clamp(startPage, 0, data.length - renderedData.length),
      renderedData
    };
    this.defaultCursor = data.length - renderedData.length - startPage;
  }
  getRenderedData(cursor) {
    switch (cursor) {
      case 0: {
        return data.slice(0, 3);
      }
      case data.length - 1: {
        return data.slice(data.length - 3);
      }
      default: {
        return data.slice(cursor - 1, cursor + 2);
      }
    }
  }
  render() {
    const {renderedData} = this.state;
    const CarouselContainer = this.container;
    return /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(TouchCarousel, {
      ref: (elt) => {
        this.carousel = elt;
      },
      component: CarouselContainer,
      cardSize,
      cardCount: renderedData.length,
      loop: false,
      renderCard: this.renderCard,
      defaultCursor: this.defaultCursor
    }));
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const ndRoot = document.getElementById("react-root");
  render(/* @__PURE__ */ React.createElement(App, null), ndRoot);
});
