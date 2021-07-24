"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _web = require("@react-spring/web");

var _utils = require("./utils");

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

function TouchMoveRecord(e) {
  var _getTouchPosition = (0, _utils.getTouchPosition)(e),
      x = _getTouchPosition.x,
      y = _getTouchPosition.y;

  this.x = x;
  this.y = y;
  this.time = Date.now();
}

var defaultProps = {
  component: 'div',
  cardSize: 320,
  cardCount: 1,
  cardPadCount: 2,
  defaultCursor: 0,
  loop: true,
  autoplay: 0,
  vertical: false,
  renderCard: function renderCard() {},
  precision: 0.001,
  tension: 200,
  friction: 25,
  moveScale: 1,
  onRest: function onRest() {},
  onDragStart: function onDragStart() {},
  onDragEnd: function onDragEnd() {},
  onDragCancel: function onDragCancel() {},
  maxOverflow: 0.5,
  clickTolerance: 2,
  ignoreCrossMove: true
};
var propsKeys = Object.keys(defaultProps);

var TouchCarousel = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TouchCarousel, _React$PureComponent);

  var _super = _createSuper(TouchCarousel);

  function TouchCarousel(props) {
    var _this;

    _classCallCheck(this, TouchCarousel);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onTouchStart", function (e) {
      var oldTouchCount = _this.touchCount;
      _this.touchCount += e.changedTouches.length;

      _this.setState({
        active: true
      });

      _this.stopAutoplay();

      _this.tracingTouchId = (0, _utils.getTouchId)(e);
      _this.touchMoves = [new TouchMoveRecord(e)];
      _this.isMovingCross = null;
      var _this$props = _this.props,
          cardSize = _this$props.cardSize,
          clickTolerance = _this$props.clickTolerance; // User click a card before it's in place but near, allow the clicking.
      // Otherwise it's only a grab.

      _this.grabbing = cardSize * Math.abs(_this.usedCursor - _this.state.cursor) > clickTolerance; // When user clicks or grabs the scroll, cancel the spring effect.

      if (!oldTouchCount) {
        _this.setCursor(_this.usedCursor).then(_this.modCursor);
      } else {
        _this.modCursor();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchMove", function (e) {
      _this.grabbing = false;
      var touchMove = new TouchMoveRecord(e);
      var touchId = (0, _utils.getTouchId)(e);

      if (touchId !== _this.tracingTouchId || !_this.touchMoves.length) {
        _this.touchMoves = [touchMove];
      }

      _this.tracingTouchId = touchId;
      var shouldIgnore = e.defaultPrevented;

      if (!shouldIgnore && _this.state.active) {
        if (_this.isMovingCross == null) {
          var _this$props2 = _this.props,
              _vertical = _this$props2.vertical,
              ignoreCrossMove = _this$props2.ignoreCrossMove;
          var factor = ignoreCrossMove;

          if (typeof factor !== 'number') {
            factor = factor ? 1 : 0;
          }

          var mainAxis = _vertical ? 'y' : 'x';
          var crossAxis = _vertical ? 'x' : 'y';
          var deltMain = Math.abs(touchMove[mainAxis] - _this.touchMoves[0][mainAxis]);
          var deltCross = Math.abs(touchMove[crossAxis] - _this.touchMoves[0][crossAxis]);
          _this.isMovingCross = deltCross * factor > deltMain;
        }

        shouldIgnore = _this.isMovingCross;
      }

      if (shouldIgnore) {
        return;
      } // Prevent the default action i.e. page scroll.
      // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
      // please use CSS `touch-action` for it.


      e.preventDefault();
      var _this$props3 = _this.props,
          cardSize = _this$props3.cardSize,
          moveScale = _this$props3.moveScale,
          vertical = _this$props3.vertical,
          onDragStart = _this$props3.onDragStart;
      var lastMove = _this.touchMoves[_this.touchMoves.length - 1];
      var xy = vertical ? 'y' : 'x';
      var distance = touchMove[xy] - lastMove[xy];

      _this.setState({
        dragging: true
      }, _this.state.dragging ? undefined : onDragStart);

      _this.setCursor(_this.state.cursor + distance / cardSize * moveScale);

      _this.touchMoves.push(touchMove);

      if (_this.touchMoves.length > 250) {
        _this.touchMoves.splice(0, 50);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchEndOrCancel", function (e) {
      var type = e.type;
      _this.touchCount -= e.changedTouches.length;

      if (_this.touchCount > 0) {
        _this.touchMoves = [];
        return;
      } // prevent click event for grab actions


      if (_this.grabbing) {
        e.preventDefault();
        e.stopPropagation();
      }

      var wasDragging = _this.state.dragging;
      var targetCursor = null; // Due to multi-touch, records can be empty even if .dragging is true.
      // So check both.

      if (wasDragging && _this.touchMoves.length) {
        var _this$props4 = _this.props,
            cardSize = _this$props4.cardSize,
            moveScale = _this$props4.moveScale,
            vertical = _this$props4.vertical;
        var friction = _this.props.friction / 1e6;

        var _assertThisInitialize = _assertThisInitialized(_this),
            touchMoves = _assertThisInitialize.touchMoves;

        var i = touchMoves.length;
        var duration = 0;

        while (--i >= 0 && duration < 100) {
          duration = Date.now() - touchMoves[i].time;
        }

        i++;
        var xy = vertical ? 'y' : 'x';
        var touchMoveVelocity = ((0, _utils.getTouchPosition)(e)[xy] - touchMoves[i][xy]) / duration;
        var momentumDistance = touchMoveVelocity * Math.abs(touchMoveVelocity) / friction / 2;
        var cursor = _this.state.cursor;
        var cursorDelta = (0, _utils.clamp)(momentumDistance / cardSize * moveScale, Math.floor(cursor) - cursor, Math.ceil(cursor) - cursor);
        targetCursor = Math.round(cursor + cursorDelta);
        _this.touchMoves = [];
      } else {
        // User grabs and then releases without any move in between.
        // Snap the cursor.
        targetCursor = Math.round(_this.state.cursor);
      }

      _this.setState({
        active: false,
        dragging: false
      }, function () {
        _this.setCursor(targetCursor);

        if (wasDragging) {
          _this.props[type === 'touchend' ? 'onDragEnd' : 'onDragCancel']();
        }
      });

      _this.tracingTouchId = null;

      _this.autoplayIfEnabled();
    });

    _defineProperty(_assertThisInitialized(_this), "onSpringRest", function () {
      if (!_this.shouldEnableSpring()) return;

      _this.setState({
        springing: false
      });

      var cursor = Math.round(_this.usedCursor);
      var index = -cursor;
      var modIndex = index % _this.props.cardCount;

      while (modIndex < 0) {
        modIndex += _this.props.cardCount;
      }

      _this.props.onRest(index, modIndex, cursor, _this.state);
    });

    _defineProperty(_assertThisInitialized(_this), "autoplayIfEnabled", function () {
      if (_this.props.autoplay) {
        _this.autoplayTimer = setInterval(_this.next, _this.props.autoplay);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "stopAutoplay", function () {
      if (_this.autoplayTimer) {
        clearInterval(_this.autoplayTimer);
        _this.autoplayTimer = null;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "go", function (n) {
      return _this.modCursor().then(function () {
        // n must be in range here.
        // That's why next()/prev() don't use this method.
        _this.setCursor(n);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "next", function () {
      return _this.modCursor().then(function () {
        _this.setCursor(_this.state.cursor - 1);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "prev", function () {
      return _this.modCursor().then(function () {
        _this.setCursor(_this.state.cursor + 1);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setCursor", function (cursor) {
      var springing = _this.shouldEnableSpring() && cursor !== _this.state.cursor;

      return new Promise(function (resolve) {
        _this.setState({
          cursor: cursor,
          springing: springing
        }, resolve);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "modAs", function (cursor) {
      return new Promise(function (resolve) {
        _this.setState({
          moding: true,
          cursor: cursor
        }, function () {
          _this.setState({
            moding: false
          }, resolve);
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "modCursor", function () {
      return new Promise(function (resolve) {
        var _this$props5 = _this.props,
            loop = _this$props5.loop,
            cardCount = _this$props5.cardCount;

        if (!loop) {
          return resolve();
        }

        var cursor = _this.state.cursor;
        var newCursor = (0, _utils.modCursor)(cursor, cardCount);

        if (newCursor !== cursor) {
          _this.modAs(newCursor).then(resolve);
        } else {
          resolve();
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "shouldEnableSpring", function () {
      var _this$state = _this.state,
          active = _this$state.active,
          moding = _this$state.moding;
      return !active && !moding;
    });

    _this.wrapSubComponents(props);

    _this.state = {
      // hack: add MIN_VALUE or react-spring v9 fails autoplay
      cursor: props.defaultCursor + Number.MIN_VALUE,
      active: false,
      dragging: false,
      springing: false,
      moding: false
    };
    _this.usedCursor = 0;
    _this.touchCount = 0;
    _this.touchMoves = [];
    _this.autoplayTimer = null;
    _this.grabbing = false;
    _this.tracingTouchId = null;
    _this.isMovingCross = null;
    return _this;
  }

  _createClass(TouchCarousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.autoplayIfEnabled();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.autoplay !== this.props.autoplay) {
        this.stopAutoplay();
        this.autoplayIfEnabled();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopAutoplay();
    }
  }, {
    key: "wrapSubComponents",
    value: function wrapSubComponents(props) {
      var _this2 = this;

      this.AnimatedComponent = (0, _web.animated)(props.component);

      var wrappedCard = function wrappedCard(_ref) {
        var index = _ref.index,
            modIndex = _ref.modIndex,
            cursor = _ref.cursor,
            state = _ref.state;
        _this2.usedCursor = cursor;
        return _this2.props.renderCard(index, modIndex, cursor, state);
      };

      this.AnimatedCard = (0, _web.animated)(wrappedCard);
    }
  }, {
    key: "getCursor",
    value: function getCursor() {
      return this.state.cursor;
    }
  }, {
    key: "getComputedCursor",
    value: function getComputedCursor() {
      var _this$props6 = this.props,
          cardCount = _this$props6.cardCount,
          loop = _this$props6.loop,
          maxOverflow = _this$props6.maxOverflow;
      var _this$state2 = this.state,
          cursor = _this$state2.cursor,
          dragging = _this$state2.dragging;
      var computedCursor = cursor;

      if (!loop) {
        computedCursor = (0, _utils.clamp)(computedCursor, 1 - cardCount, 0);

        if (dragging && cursor > 0) {
          computedCursor = maxOverflow - maxOverflow / (cursor + 1);
        } else if (dragging && cursor < 1 - cardCount) {
          computedCursor = 1 - cardCount - maxOverflow + maxOverflow / (1 - cardCount - cursor + 1);
        }
      }

      return computedCursor;
    }
  }, {
    key: "getUsedCursor",
    value: function getUsedCursor() {
      return this.usedCursor;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var AnimatedComponent = this.AnimatedComponent,
          AnimatedCard = this.AnimatedCard;

      var _this$props7 = this.props,
          cardSize = _this$props7.cardSize,
          cardCount = _this$props7.cardCount,
          cardPadCount = _this$props7.cardPadCount,
          renderCard = _this$props7.renderCard,
          tension = _this$props7.tension,
          friction = _this$props7.friction,
          precision = _this$props7.precision,
          loop = _this$props7.loop,
          rest = _objectWithoutProperties(_this$props7, ["cardSize", "cardCount", "cardPadCount", "renderCard", "tension", "friction", "precision", "loop"]);

      var padCount = loop ? cardPadCount : 0;
      var springConfig = {
        tension: tension,
        friction: friction,
        precision: precision
      };
      var computedCursor = this.getComputedCursor();
      return /*#__PURE__*/_react["default"].createElement(_web.Spring, {
        config: springConfig,
        from: {
          cursor: computedCursor
        },
        immediate: !this.shouldEnableSpring(),
        to: {
          cursor: computedCursor
        },
        onRest: this.onSpringRest
      }, function (_ref2) {
        var cursor = _ref2.cursor;
        return /*#__PURE__*/_react["default"].createElement(AnimatedComponent, _extends({}, (0, _utils.omit)(rest, propsKeys), {
          cursor: cursor,
          carouselState: _this3.state,
          onTouchStart: _this3.onTouchStart,
          onTouchMove: _this3.onTouchMove,
          onTouchEnd: _this3.onTouchEndOrCancel,
          onTouchCancel: _this3.onTouchEndOrCancel
        }), (0, _utils.range)(0 - padCount, cardCount - 1 + padCount).map(function (index) {
          var modIndex = index % cardCount;

          while (modIndex < 0) {
            modIndex += cardCount;
          }

          return /*#__PURE__*/_react["default"].createElement(AnimatedCard, {
            key: index,
            index: index,
            modIndex: modIndex,
            cursor: cursor,
            state: _this3.state
          });
        }));
      });
    }
  }]);

  return TouchCarousel;
}(_react["default"].PureComponent);

TouchCarousel.defaultProps = defaultProps;
var _default = TouchCarousel;
exports["default"] = _default;