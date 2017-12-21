'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = touchWithMouseHOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Mouse support. See #4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Maybe worth a separate package like "react-touch-with-mouse"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var mockEventTypes = {
  mousedown: 'touchstart',
  mousemove: 'touchmove',
  mouseup: 'touchend',
  blur: 'touchcancel'
};

var distance = function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

function touchWithMouseHOC(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var clickTolerance = options.clickTolerance || 5;

  var TouchWithMouse = function (_React$Component) {
    _inherits(TouchWithMouse, _React$Component);

    function TouchWithMouse(props) {
      _classCallCheck(this, TouchWithMouse);

      var _this = _possibleConstructorReturn(this, (TouchWithMouse.__proto__ || Object.getPrototypeOf(TouchWithMouse)).call(this, props));

      _this.mockTouchEvent = function (e) {
        var overwrites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return {
          changedTouches: overwrites.changedTouches || [{ identifier: _this.mouseTouchId, pageX: e.pageX, pageY: e.pageY }],
          type: mockEventTypes[e.type] || e.type,
          preventDefault: e.preventDefault.bind(e),
          stopPropagation: e.stopPropagation.bind(e)
        };
      };

      _this.onMouseDown = function (e) {
        _this.props.onMouseDown(e);
        _this.isMouseDown = true;
        _this.mouseDownId++;
        _this.clickStartX = e.pageX;
        _this.clickStartY = e.pageY;
        _this.props.onTouchStart(_this.mockTouchEvent(e));
      };

      _this.onDocumentMouseMove = function (e) {
        if (!_this.isMouseDown) {
          return;
        }
        _this.lastMoveEvent = _this.mockTouchEvent(e);
        _this.props.onTouchMove(_this.lastMoveEvent);
      };

      _this.onDocumentMouseUp = function (e) {
        if (!_this.isMouseDown) {
          return;
        }
        _this.isMouseDown = false;
        _this.props.onTouchEnd(_this.mockTouchEvent(e));
        // This waits for the click event, so we know to prevent it
        setTimeout(function () {
          _this.clickStartX = null;
          _this.clickStartY = null;
        }, 0);
      };

      _this.onWindowBlur = function (e) {
        if (!_this.isMouseDown) {
          return;
        }
        _this.isMouseDown = false;
        _this.clickStartX = null;
        _this.clickStartY = null;
        var mockTouchCancelEvent = _this.mockTouchEvent(e, {
          changedTouches: _this.lastMoveEvent.changedTouches
        });
        _this.props.onTouchCancel(mockTouchCancelEvent);
      };

      _this.onDocumentClick = function (e) {
        if (_this.clickStartX !== null && _this.clickStartY !== null && distance(_this.clickStartX, _this.clickStartY, e.pageX, e.pageY) > clickTolerance) {
          _this.clickStartX = null;
          _this.clickStartY = null;
          e.preventDefault();
          e.stopPropagation();
        }
      };

      _this.isMouseDown = false;
      _this.mouseDownId = 0;
      _this.lastMoveEvent = null;
      _this.clickStartX = null;
      _this.clickStartY = null;
      return _this;
    }

    _createClass(TouchWithMouse, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        document.addEventListener('mousemove', this.onDocumentMouseMove);
        document.addEventListener('mouseup', this.onDocumentMouseUp);
        // Listen in the capture phase, so we can prevent the clicks
        document.addEventListener('click', this.onDocumentClick, true);
        window.addEventListener('blur', this.onWindowBlur);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        document.removeEventListener('mousemove', this.onDocumentMouseMove);
        document.removeEventListener('mouseup', this.onDocumentMouseUp);
        document.removeEventListener('click', this.onDocumentClick, true);
        window.removeEventListener('blur', this.onWindowBlur);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            onMouseDown = _props.onMouseDown,
            rest = _objectWithoutProperties(_props, ['onMouseDown']);

        return _react2.default.createElement(Component, _extends({}, rest, {
          onMouseDown: this.onMouseDown
        }));
      }
    }]);

    return TouchWithMouse;
  }(_react2.default.Component);

  TouchWithMouse.defaultProps = {
    onMouseDown: function onMouseDown() {},
    onTouchStart: function onTouchStart() {},
    onTouchMove: function onTouchMove() {},
    onTouchEnd: function onTouchEnd() {},
    onTouchCancel: function onTouchCancel() {}
  };

  TouchWithMouse.displayName = 'TouchWithMouse(' + (Component.displayName || Component.name) + ')';

  return TouchWithMouse;
}

