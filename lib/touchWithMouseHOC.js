"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = touchWithMouseHOC;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  var TouchWithMouse = /*#__PURE__*/function (_React$Component) {
    _inherits(TouchWithMouse, _React$Component);

    var _super = _createSuper(TouchWithMouse);

    function TouchWithMouse(props) {
      var _this;

      _classCallCheck(this, TouchWithMouse);

      _this = _super.call(this, props);

      _defineProperty(_assertThisInitialized(_this), "mockTouchEvent", function (e) {
        var overwrites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return {
          changedTouches: overwrites.changedTouches || [{
            identifier: _this.mouseTouchId,
            pageX: e.pageX,
            pageY: e.pageY
          }],
          type: mockEventTypes[e.type] || e.type,
          preventDefault: e.preventDefault.bind(e),
          stopPropagation: e.stopPropagation.bind(e)
        };
      });

      _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (e) {
        _this.props.onMouseDown(e);

        _this.isMouseDown = true;
        _this.mouseDownId++;
        _this.clickStartX = e.pageX;
        _this.clickStartY = e.pageY;

        _this.props.onTouchStart(_this.mockTouchEvent(e));
      });

      _defineProperty(_assertThisInitialized(_this), "onDocumentMouseMove", function (e) {
        if (!_this.isMouseDown) {
          return;
        }

        _this.lastMoveEvent = _this.mockTouchEvent(e);

        _this.props.onTouchMove(_this.lastMoveEvent);
      });

      _defineProperty(_assertThisInitialized(_this), "onDocumentMouseUp", function (e) {
        if (!_this.isMouseDown) {
          return;
        }

        _this.isMouseDown = false;

        _this.props.onTouchEnd(_this.mockTouchEvent(e)); // This waits for the click event, so we know to prevent it


        setTimeout(function () {
          _this.clickStartX = null;
          _this.clickStartY = null;
        }, 0);
      });

      _defineProperty(_assertThisInitialized(_this), "onWindowBlur", function (e) {
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
      });

      _defineProperty(_assertThisInitialized(_this), "onDocumentClick", function (e) {
        if (_this.clickStartX !== null && _this.clickStartY !== null && distance(_this.clickStartX, _this.clickStartY, e.pageX, e.pageY) > clickTolerance) {
          _this.clickStartX = null;
          _this.clickStartY = null;
          e.preventDefault();
          e.stopPropagation();
        }
      });

      _this.isMouseDown = false;
      _this.mouseDownId = 0;
      _this.lastMoveEvent = null;
      _this.clickStartX = null;
      _this.clickStartY = null;
      return _this;
    }

    _createClass(TouchWithMouse, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener('mousemove', this.onDocumentMouseMove);
        document.addEventListener('mouseup', this.onDocumentMouseUp); // Listen in the capture phase, so we can prevent the clicks

        document.addEventListener('click', this.onDocumentClick, true);
        window.addEventListener('blur', this.onWindowBlur);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener('mousemove', this.onDocumentMouseMove);
        document.removeEventListener('mouseup', this.onDocumentMouseUp);
        document.removeEventListener('click', this.onDocumentClick, true);
        window.removeEventListener('blur', this.onWindowBlur);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            onMouseDown = _this$props.onMouseDown,
            rest = _objectWithoutProperties(_this$props, ["onMouseDown"]);

        return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, rest, {
          onMouseDown: this.onMouseDown
        }));
      }
    }]);

    return TouchWithMouse;
  }(_react["default"].Component);

  TouchWithMouse.defaultProps = {
    onMouseDown: function onMouseDown() {},
    onTouchStart: function onTouchStart() {},
    onTouchMove: function onTouchMove() {},
    onTouchEnd: function onTouchEnd() {},
    onTouchCancel: function onTouchCancel() {}
  };
  TouchWithMouse.displayName = "TouchWithMouse(".concat(Component.displayName || Component.name, ")");
  return TouchWithMouse;
}