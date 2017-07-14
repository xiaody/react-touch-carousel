'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTouchPosition = exports.precision = exports.clamp = exports.range = undefined;

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

var _TouchCarousel = require('./TouchCarousel');

var _TouchCarousel2 = _interopRequireDefault(_TouchCarousel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TouchCarousel2.default;

