"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = range;
exports.clamp = clamp;
exports.precision = precision;
exports.getTouchPosition = getTouchPosition;
exports.getTouchId = getTouchId;
exports.omit = omit;
function range(start, end) {
  var ret = [];
  for (var i = start; i <= end; i++) {
    ret.push(i);
  }
  return ret;
}

function clamp(n, min, max) {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
}

function precision(n, p) {
  return Math.round(n / p) * p;
}

function getTouchPosition(e) {
  return {
    x: e.changedTouches[0].pageX,
    y: e.changedTouches[0].pageY
  };
}

function getTouchId(e) {
  return e.changedTouches[0].identifier;
}

function omit(obj, keys) {
  var ret = {};
  Object.keys(obj).forEach(function (k) {
    if (keys.includes(k)) return;
    ret[k] = obj[k];
  });
  return ret;
}

