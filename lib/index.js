"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "range", {
  enumerable: true,
  get: function get() {
    return _utils.range;
  }
});
Object.defineProperty(exports, "clamp", {
  enumerable: true,
  get: function get() {
    return _utils.clamp;
  }
});
Object.defineProperty(exports, "getTouchPosition", {
  enumerable: true,
  get: function get() {
    return _utils.getTouchPosition;
  }
});
Object.defineProperty(exports, "getTouchId", {
  enumerable: true,
  get: function get() {
    return _utils.getTouchId;
  }
});
Object.defineProperty(exports, "omit", {
  enumerable: true,
  get: function get() {
    return _utils.omit;
  }
});
Object.defineProperty(exports, "modCursor", {
  enumerable: true,
  get: function get() {
    return _utils.modCursor;
  }
});
exports["default"] = void 0;

var _TouchCarousel = _interopRequireDefault(require("./TouchCarousel"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _TouchCarousel["default"];
exports["default"] = _default;