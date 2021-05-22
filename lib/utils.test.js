"use strict";

var _ava = _interopRequireDefault(require("ava"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _ava["default"])('modCursor', function (t) {
  t.is((0, _utils.modCursor)(0.9, 7), -6.1);
  t.is((0, _utils.modCursor)(0, 7), 0);
  t.is((0, _utils.modCursor)(-1, 7), -1);
  t.is((0, _utils.modCursor)(-6.2, 7), -6.2);
  t.is((0, _utils.modCursor)(-7, 7), 0);
});