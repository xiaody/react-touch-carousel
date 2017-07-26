'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  cardSize: global.innerWidth || 320,
  cardCount: 1,
  cardPadCount: 2,
  defaultCursor: 0,
  loop: true,
  autoplay: 0,
  vertical: false,
  renderCard: function renderCard() {},

  precision: 0.001,
  moveScale: 1,
  stiffness: 200,
  damping: 25,
  maxOverflow: 0.5,
  clickTolerance: 2,
  ignoreCrossMove: true
};

var propsKeys = Object.keys(defaultProps);

var TouchCarousel = function (_React$PureComponent) {
  _inherits(TouchCarousel, _React$PureComponent);

  function TouchCarousel(props) {
    _classCallCheck(this, TouchCarousel);

    var _this = _possibleConstructorReturn(this, (TouchCarousel.__proto__ || Object.getPrototypeOf(TouchCarousel)).call(this, props));

    _this.onTouchStart = function (e) {
      var oldTouchCount = _this.touchCount;
      _this.touchCount += e.changedTouches.length;
      _this.setState({ active: true });
      _this.stopAutoplay();
      _this.tracingTouchId = (0, _utils.getTouchId)(e);
      _this.touchMoves = [new TouchMoveRecord(e)];
      _this.touchMoveDirection = null;
      var _this$props = _this.props,
          cardSize = _this$props.cardSize,
          clickTolerance = _this$props.clickTolerance;
      // User click a card before it's in place but near, allow the clicking.
      // Otherwise it's only a grab.

      _this.grabbing = cardSize * Math.abs(_this.usedCursor - _this.state.cursor) > clickTolerance;
      // When user clicks or grabs the scroll, cancel the spring effect.
      if (!oldTouchCount) {
        _this.setCursor(_this.usedCursor).then(_this.modCursor);
      } else {
        _this.modCursor();
      }
    };

    _this.onTouchMove = function (e) {
      _this.grabbing = false;
      var touchMove = new TouchMoveRecord(e);
      var touchId = (0, _utils.getTouchId)(e);
      if (touchId !== _this.tracingTouchId) {
        _this.touchMoves = [touchMove];
      }
      _this.tracingTouchId = touchId;

      var shouldIgnore = false;
      if (_this.props.ignoreCrossMove && _this.state.active && _this.touchMoves.length) {
        var _vertical = _this.props.vertical;

        var touchMoveDirection = _this.touchMoveDirection = _this.touchMoveDirection || (Math.abs(touchMove.y - _this.touchMoves[0].y) > Math.abs(touchMove.x - _this.touchMoves[0].x) ? 'vertical' : 'horizontal');
        shouldIgnore = touchMoveDirection === 'vertical' && !_vertical || touchMoveDirection === 'horizontal' && _vertical;
      }

      if (shouldIgnore) {
        return;
      }

      // Prevent the default action i.e. page scroll.
      // NOTE: in Chrome 56+ touchmove event listeners are passive by default,
      // please use CSS `touch-action` for it.
      e.preventDefault();

      var _this$props2 = _this.props,
          cardSize = _this$props2.cardSize,
          moveScale = _this$props2.moveScale,
          vertical = _this$props2.vertical;

      var lastMove = _this.touchMoves[_this.touchMoves.length - 1];
      var xy = vertical ? 'y' : 'x';
      var distance = touchMove[xy] - lastMove[xy];
      _this.setState({ dragging: true });
      _this.setCursor(_this.state.cursor + distance / cardSize * moveScale, true);

      _this.touchMoves.push(touchMove);
      if (_this.touchMoves.length > 250) {
        _this.touchMoves.splice(0, 50);
      }
    };

    _this.onTouchEnd = function (e) {
      _this.touchCount -= e.changedTouches.length;
      if (_this.touchCount > 0) {
        _this.touchMoves = [];
        return;
      }

      // prevent click event for grab actions
      if (_this.grabbing) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Due to multi-touch, records can be empty even if .dragging is true.
      // So check both.
      if (_this.state.dragging && _this.touchMoves.length) {
        var _this$props3 = _this.props,
            cardSize = _this$props3.cardSize,
            moveScale = _this$props3.moveScale,
            vertical = _this$props3.vertical;

        var damping = _this.props.damping / 1e6;
        var touchMoves = _this.touchMoves;

        var i = touchMoves.length;
        var duration = 0;
        while (--i >= 0 && duration < 100) {
          duration = Date.now() - touchMoves[i].time;
        }
        i++;
        var xy = vertical ? 'y' : 'x';
        var touchMoveVelocity = ((0, _utils.getTouchPosition)(e)[xy] - touchMoves[i][xy]) / duration;
        var momentumDistance = touchMoveVelocity * Math.abs(touchMoveVelocity) / damping / 2;
        var cursor = _this.state.cursor;

        var cursorDelta = (0, _utils.clamp)(momentumDistance / cardSize * moveScale, Math.floor(cursor) - cursor, Math.ceil(cursor) - cursor);
        _this.setCursor(Math.round(cursor + cursorDelta));
        _this.touchMoves = [];
      } else {
        // User grabs and then releases without any move in between.
        // Snap the cursor.
        _this.setCursor(Math.round(_this.state.cursor));
      }
      _this.setState({ active: false, dragging: false });
      _this.tracingTouchId = null;
      _this.autoplayIfEnabled();
    };

    _this.autoplayIfEnabled = function () {
      if (_this.props.autoplay) {
        _this.autoplayTimer = setInterval(_this.next, _this.props.autoplay);
      }
    };

    _this.stopAutoplay = function () {
      if (_this.autoplayTimer) {
        clearInterval(_this.autoplayTimer);
        _this.autoplayTimer = null;
      }
    };

    _this.go = function (n) {
      return _this.modCursor().then(function () {
        // n must be in range here.
        // That's why next()/prev() don't use this method.
        _this.setCursor(n);
      });
    };

    _this.next = function () {
      return _this.modCursor().then(function () {
        _this.setCursor(_this.state.cursor - 1);
      });
    };

    _this.prev = function () {
      return _this.modCursor().then(function () {
        _this.setCursor(_this.state.cursor + 1);
      });
    };

    _this.setCursor = function (cursor) {
      return new Promise(function (resolve) {
        _this.setState({ cursor: cursor }, resolve);
      });
    };

    _this.modeAs = function (cursor) {
      return new Promise(function (resolve) {
        _this.setState({ moding: true, cursor: cursor }, function () {
          _this.setState({ moding: false }, resolve);
        });
      });
    };

    _this.modCursor = function () {
      return new Promise(function (resolve) {
        var _this$props4 = _this.props,
            loop = _this$props4.loop,
            cardCount = _this$props4.cardCount;

        if (!loop) {
          return resolve();
        }
        var cursor = _this.state.cursor;

        var newCursor = cursor;
        while (newCursor > 0) {
          newCursor -= cardCount;
        }
        while (newCursor < 1 - cardCount) {
          newCursor += cardCount;
        }
        if (newCursor !== cursor) {
          _this.modeAs(newCursor).then(resolve);
        } else {
          resolve();
        }
      });
    };

    _this.state = {
      cursor: props.defaultCursor,
      active: false,
      dragging: false,
      moding: false
    };
    _this.usedCursor = 0;
    _this.touchCount = 0;
    _this.touchMoves = [];
    _this.autoplayTimer = null;
    _this.grabbing = false;
    _this.tracingTouchId = null;
    _this.touchMoveDirection = null;
    return _this;
  }

  _createClass(TouchCarousel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.autoplayIfEnabled();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stopAutoplay();
    }
  }, {
    key: 'getCursor',
    value: function getCursor() {
      return this.state.cursor;
    }
  }, {
    key: 'getComputedCursor',
    value: function getComputedCursor() {
      var _props = this.props,
          cardCount = _props.cardCount,
          loop = _props.loop,
          maxOverflow = _props.maxOverflow;
      var _state = this.state,
          cursor = _state.cursor,
          dragging = _state.dragging;

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
    key: 'getUsedCursor',
    value: function getUsedCursor() {
      return this.usedCursor;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          Component = _props2.component,
          cardSize = _props2.cardSize,
          cardCount = _props2.cardCount,
          cardPadCount = _props2.cardPadCount,
          renderCard = _props2.renderCard,
          stiffness = _props2.stiffness,
          damping = _props2.damping,
          precision = _props2.precision,
          loop = _props2.loop,
          rest = _objectWithoutProperties(_props2, ['component', 'cardSize', 'cardCount', 'cardPadCount', 'renderCard', 'stiffness', 'damping', 'precision', 'loop']);

      var _state2 = this.state,
          active = _state2.active,
          dragging = _state2.dragging,
          moding = _state2.moding;

      var padCount = loop ? cardPadCount : 0;
      var springConfig = { stiffness: stiffness, damping: damping, precision: precision };
      var computedCursor = this.getComputedCursor();

      return _react2.default.createElement(
        _reactMotion.Motion,
        {
          defaultStyle: { cursor: computedCursor },
          style: {
            cursor: dragging || moding ? (0, _utils.precision)(computedCursor, precision) : (0, _reactMotion.spring)(computedCursor, springConfig)
          }
        },
        function (_ref) {
          var cursor = _ref.cursor;

          _this2.usedCursor = cursor;
          return _react2.default.createElement(
            Component,
            _extends({}, (0, _utils.omit)(rest, propsKeys), {
              cursor: cursor,
              active: active,
              dragging: dragging,
              onTouchStart: _this2.onTouchStart,
              onTouchMove: _this2.onTouchMove,
              onTouchEnd: _this2.onTouchEnd
            }),
            (0, _utils.range)(0 - padCount, cardCount - 1 + padCount).map(function (index) {
              var modIndex = index % cardCount;
              while (modIndex < 0) {
                modIndex += cardCount;
              }
              return renderCard(index, modIndex, cursor);
            })
          );
        }
      );
    }
  }]);

  return TouchCarousel;
}(_react2.default.PureComponent);

TouchCarousel.defaultProps = defaultProps;

exports.default = TouchCarousel;

