'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modCursor = exports.omit = exports.getTouchId = exports.getTouchPosition = exports.precision = exports.clamp = exports.range = undefined;

var _utils = require('./utils');

Object.defineProperty(exports, 'range', {
  enumerable: true,
  get: function get() {
    return _utils.range;
  }
});
Object.defineProperty(exports, 'clamp', {
  enumerable: true,
  get: function get() {
    return _utils.clamp;
  }
});
Object.defineProperty(exports, 'precision', {
  enumerable: true,
  get: function get() {
    return _utils.precision;
  }
});
Object.defineProperty(exports, 'getTouchPosition', {
  enumerable: true,
  get: function get() {
    return _utils.getTouchPosition;
  }
});
Object.defineProperty(exports, 'getTouchId', {
  enumerable: true,
  get: function get() {
    return _utils.getTouchId;
  }
});
Object.defineProperty(exports, 'omit', {
  enumerable: true,
  get: function get() {
    return _utils.omit;
  }
});
Object.defineProperty(exports, 'modCursor', {
  enumerable: true,
  get: function get() {
    return _utils.modCursor;
  }
});

var _TouchCarousel = require('./TouchCarousel');

var _TouchCarousel2 = _interopRequireDefault(_TouchCarousel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TouchCarousel2.default;

