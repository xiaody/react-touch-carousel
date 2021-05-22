import {c as createCommonjsModule} from "../common/_commonjsHelpers-668e6127.js";
import {r as react} from "../common/index-59cd3494.js";
import {r as reactDom} from "../common/index-a3f3ee13.js";
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var renderprops = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var _objectWithoutPropertiesLoose$1 = _interopDefault(_objectWithoutPropertiesLoose);
  var _extends$1 = _interopDefault(_extends);
  var React__default = _interopDefault(react);
  var ReactDOM = _interopDefault(reactDom);
  let bugfixes = void 0;
  let applyAnimatedValues = void 0;
  let colorNames = [];
  let requestFrame = (cb) => typeof window !== "undefined" && window.requestAnimationFrame(cb);
  let cancelFrame = (cb) => typeof window !== "undefined" && window.cancelAnimationFrame(cb);
  let interpolation = void 0;
  let now = () => Date.now();
  let defaultElement = void 0;
  let createAnimatedStyle = void 0;
  const injectApplyAnimatedValues = (fn, transform) => applyAnimatedValues = {
    fn,
    transform
  };
  const injectColorNames = (names) => colorNames = names;
  const injectBugfixes = (fn) => bugfixes = fn;
  const injectInterpolation = (cls) => interpolation = cls;
  const injectFrame = (raf, caf) => {
    var _ref = [raf, caf];
    requestFrame = _ref[0];
    cancelFrame = _ref[1];
    return _ref;
  };
  const injectNow = (nowFn) => now = nowFn;
  const injectDefaultElement = (el) => defaultElement = el;
  const injectCreateAnimatedStyle = (factory) => createAnimatedStyle = factory;
  var Globals = /* @__PURE__ */ Object.freeze({
    get bugfixes() {
      return bugfixes;
    },
    get applyAnimatedValues() {
      return applyAnimatedValues;
    },
    get colorNames() {
      return colorNames;
    },
    get requestFrame() {
      return requestFrame;
    },
    get cancelFrame() {
      return cancelFrame;
    },
    get interpolation() {
      return interpolation;
    },
    get now() {
      return now;
    },
    get defaultElement() {
      return defaultElement;
    },
    get createAnimatedStyle() {
      return createAnimatedStyle;
    },
    injectApplyAnimatedValues,
    injectColorNames,
    injectBugfixes,
    injectInterpolation,
    injectFrame,
    injectNow,
    injectDefaultElement,
    injectCreateAnimatedStyle
  });
  class Animated {
    attach() {
    }
    detach() {
    }
    getValue() {
    }
    getAnimatedValue() {
      return this.getValue();
    }
    addChild(child) {
    }
    removeChild(child) {
    }
    getChildren() {
      return [];
    }
  }
  const getValues = (object) => Object.keys(object).map((k) => object[k]);
  class AnimatedWithChildren extends Animated {
    constructor() {
      var _this;
      super(...arguments);
      _this = this;
      this.children = [];
      this.getChildren = () => this.children;
      this.getPayload = function(index) {
        if (index === void 0) {
          index = void 0;
        }
        return index !== void 0 && _this.payload ? _this.payload[index] : _this.payload || _this;
      };
    }
    addChild(child) {
      if (this.children.length === 0)
        this.attach();
      this.children.push(child);
    }
    removeChild(child) {
      const index = this.children.indexOf(child);
      this.children.splice(index, 1);
      if (this.children.length === 0)
        this.detach();
    }
  }
  class AnimatedArrayWithChildren extends AnimatedWithChildren {
    constructor() {
      super(...arguments);
      this.payload = [];
      this.getAnimatedValue = () => this.getValue();
      this.attach = () => this.payload.forEach((p) => p instanceof Animated && p.addChild(this));
      this.detach = () => this.payload.forEach((p) => p instanceof Animated && p.removeChild(this));
    }
  }
  class AnimatedObjectWithChildren extends AnimatedWithChildren {
    constructor() {
      super(...arguments);
      this.payload = {};
      this.getAnimatedValue = () => this.getValue(true);
      this.attach = () => getValues(this.payload).forEach((s) => s instanceof Animated && s.addChild(this));
      this.detach = () => getValues(this.payload).forEach((s) => s instanceof Animated && s.removeChild(this));
    }
    getValue(animated) {
      if (animated === void 0) {
        animated = false;
      }
      const payload = {};
      for (const key in this.payload) {
        const value = this.payload[key];
        if (animated && !(value instanceof Animated))
          continue;
        payload[key] = value instanceof Animated ? value[animated ? "getAnimatedValue" : "getValue"]() : value;
      }
      return payload;
    }
  }
  class AnimatedStyle extends AnimatedObjectWithChildren {
    constructor(style) {
      super();
      style = style || {};
      if (style.transform && !(style.transform instanceof Animated))
        style = applyAnimatedValues.transform(style);
      this.payload = style;
    }
  }
  const colors = {
    transparent: 0,
    aliceblue: 4042850303,
    antiquewhite: 4209760255,
    aqua: 16777215,
    aquamarine: 2147472639,
    azure: 4043309055,
    beige: 4126530815,
    bisque: 4293182719,
    black: 255,
    blanchedalmond: 4293643775,
    blue: 65535,
    blueviolet: 2318131967,
    brown: 2771004159,
    burlywood: 3736635391,
    burntsienna: 3934150143,
    cadetblue: 1604231423,
    chartreuse: 2147418367,
    chocolate: 3530104575,
    coral: 4286533887,
    cornflowerblue: 1687547391,
    cornsilk: 4294499583,
    crimson: 3692313855,
    cyan: 16777215,
    darkblue: 35839,
    darkcyan: 9145343,
    darkgoldenrod: 3095792639,
    darkgray: 2846468607,
    darkgreen: 6553855,
    darkgrey: 2846468607,
    darkkhaki: 3182914559,
    darkmagenta: 2332068863,
    darkolivegreen: 1433087999,
    darkorange: 4287365375,
    darkorchid: 2570243327,
    darkred: 2332033279,
    darksalmon: 3918953215,
    darkseagreen: 2411499519,
    darkslateblue: 1211993087,
    darkslategray: 793726975,
    darkslategrey: 793726975,
    darkturquoise: 13554175,
    darkviolet: 2483082239,
    deeppink: 4279538687,
    deepskyblue: 12582911,
    dimgray: 1768516095,
    dimgrey: 1768516095,
    dodgerblue: 512819199,
    firebrick: 2988581631,
    floralwhite: 4294635775,
    forestgreen: 579543807,
    fuchsia: 4278255615,
    gainsboro: 3705462015,
    ghostwhite: 4177068031,
    gold: 4292280575,
    goldenrod: 3668254975,
    gray: 2155905279,
    green: 8388863,
    greenyellow: 2919182335,
    grey: 2155905279,
    honeydew: 4043305215,
    hotpink: 4285117695,
    indianred: 3445382399,
    indigo: 1258324735,
    ivory: 4294963455,
    khaki: 4041641215,
    lavender: 3873897215,
    lavenderblush: 4293981695,
    lawngreen: 2096890111,
    lemonchiffon: 4294626815,
    lightblue: 2916673279,
    lightcoral: 4034953471,
    lightcyan: 3774873599,
    lightgoldenrodyellow: 4210742015,
    lightgray: 3553874943,
    lightgreen: 2431553791,
    lightgrey: 3553874943,
    lightpink: 4290167295,
    lightsalmon: 4288707327,
    lightseagreen: 548580095,
    lightskyblue: 2278488831,
    lightslategray: 2005441023,
    lightslategrey: 2005441023,
    lightsteelblue: 2965692159,
    lightyellow: 4294959359,
    lime: 16711935,
    limegreen: 852308735,
    linen: 4210091775,
    magenta: 4278255615,
    maroon: 2147483903,
    mediumaquamarine: 1724754687,
    mediumblue: 52735,
    mediumorchid: 3126187007,
    mediumpurple: 2473647103,
    mediumseagreen: 1018393087,
    mediumslateblue: 2070474495,
    mediumspringgreen: 16423679,
    mediumturquoise: 1221709055,
    mediumvioletred: 3340076543,
    midnightblue: 421097727,
    mintcream: 4127193855,
    mistyrose: 4293190143,
    moccasin: 4293178879,
    navajowhite: 4292783615,
    navy: 33023,
    oldlace: 4260751103,
    olive: 2155872511,
    olivedrab: 1804477439,
    orange: 4289003775,
    orangered: 4282712319,
    orchid: 3664828159,
    palegoldenrod: 4008225535,
    palegreen: 2566625535,
    paleturquoise: 2951671551,
    palevioletred: 3681588223,
    papayawhip: 4293907967,
    peachpuff: 4292524543,
    peru: 3448061951,
    pink: 4290825215,
    plum: 3718307327,
    powderblue: 2967529215,
    purple: 2147516671,
    rebeccapurple: 1714657791,
    red: 4278190335,
    rosybrown: 3163525119,
    royalblue: 1097458175,
    saddlebrown: 2336560127,
    salmon: 4202722047,
    sandybrown: 4104413439,
    seagreen: 780883967,
    seashell: 4294307583,
    sienna: 2689740287,
    silver: 3233857791,
    skyblue: 2278484991,
    slateblue: 1784335871,
    slategray: 1887473919,
    slategrey: 1887473919,
    snow: 4294638335,
    springgreen: 16744447,
    steelblue: 1182971135,
    tan: 3535047935,
    teal: 8421631,
    thistle: 3636451583,
    tomato: 4284696575,
    turquoise: 1088475391,
    violet: 4001558271,
    wheat: 4125012991,
    white: 4294967295,
    whitesmoke: 4126537215,
    yellow: 4294902015,
    yellowgreen: 2597139199
  };
  class Interpolation {
    static create(config2, output, extra) {
      if (typeof config2 === "function")
        return config2;
      else if (interpolation && config2.output && typeof config2.output[0] === "string")
        return interpolation(config2);
      else if (Array.isArray(config2))
        return Interpolation.create({
          range: config2,
          output,
          extrapolate: extra || "extend"
        });
      let outputRange = config2.output;
      let inputRange = config2.range || [0, 1];
      let easing = config2.easing || ((t) => t);
      let extrapolateLeft = "extend";
      let map = config2.map;
      if (config2.extrapolateLeft !== void 0)
        extrapolateLeft = config2.extrapolateLeft;
      else if (config2.extrapolate !== void 0)
        extrapolateLeft = config2.extrapolate;
      let extrapolateRight = "extend";
      if (config2.extrapolateRight !== void 0)
        extrapolateRight = config2.extrapolateRight;
      else if (config2.extrapolate !== void 0)
        extrapolateRight = config2.extrapolate;
      return (input) => {
        let range = findRange(input, inputRange);
        return interpolate(input, inputRange[range], inputRange[range + 1], outputRange[range], outputRange[range + 1], easing, extrapolateLeft, extrapolateRight, map);
      };
    }
  }
  function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
    let result = map ? map(input) : input;
    if (result < inputMin) {
      if (extrapolateLeft === "identity")
        return result;
      else if (extrapolateLeft === "clamp")
        result = inputMin;
    }
    if (result > inputMax) {
      if (extrapolateRight === "identity")
        return result;
      else if (extrapolateRight === "clamp")
        result = inputMax;
    }
    if (outputMin === outputMax)
      return outputMin;
    if (inputMin === inputMax)
      return input <= inputMin ? outputMin : outputMax;
    if (inputMin === -Infinity)
      result = -result;
    else if (inputMax === Infinity)
      result = result - inputMin;
    else
      result = (result - inputMin) / (inputMax - inputMin);
    result = easing(result);
    if (outputMin === -Infinity)
      result = -result;
    else if (outputMax === Infinity)
      result = result + outputMin;
    else
      result = result * (outputMax - outputMin) + outputMin;
    return result;
  }
  function findRange(input, inputRange) {
    for (var i = 1; i < inputRange.length - 1; ++i)
      if (inputRange[i] >= input)
        break;
    return i - 1;
  }
  const NUMBER = "[-+]?\\d*\\.?\\d+";
  const PERCENTAGE = NUMBER + "%";
  function call() {
    return "\\(\\s*(" + Array.prototype.slice.call(arguments).join(")\\s*,\\s*(") + ")\\s*\\)";
  }
  const rgb = new RegExp("rgb" + call(NUMBER, NUMBER, NUMBER));
  const rgba = new RegExp("rgba" + call(NUMBER, NUMBER, NUMBER, NUMBER));
  const hsl = new RegExp("hsl" + call(NUMBER, PERCENTAGE, PERCENTAGE));
  const hsla = new RegExp("hsla" + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
  const hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
  const hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
  const hex6 = /^#([0-9a-fA-F]{6})$/;
  const hex8 = /^#([0-9a-fA-F]{8})$/;
  function normalizeColor(color) {
    let match;
    if (typeof color === "number") {
      return color >>> 0 === color && color >= 0 && color <= 4294967295 ? color : null;
    }
    if (match = hex6.exec(color))
      return parseInt(match[1] + "ff", 16) >>> 0;
    if (colors.hasOwnProperty(color))
      return colors[color];
    if (match = rgb.exec(color)) {
      return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | 255) >>> 0;
    }
    if (match = rgba.exec(color)) {
      return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | parse1(match[4])) >>> 0;
    }
    if (match = hex3.exec(color)) {
      return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + "ff", 16) >>> 0;
    }
    if (match = hex8.exec(color))
      return parseInt(match[1], 16) >>> 0;
    if (match = hex4.exec(color)) {
      return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + match[4] + match[4], 16) >>> 0;
    }
    if (match = hsl.exec(color)) {
      return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | 255) >>> 0;
    }
    if (match = hsla.exec(color)) {
      return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | parse1(match[4])) >>> 0;
    }
    return null;
  }
  function hue2rgb(p, q, t) {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslToRgb(h, s, l) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
  }
  function parse255(str) {
    const int = parseInt(str, 10);
    if (int < 0)
      return 0;
    if (int > 255)
      return 255;
    return int;
  }
  function parse360(str) {
    const int = parseFloat(str);
    return (int % 360 + 360) % 360 / 360;
  }
  function parse1(str) {
    const num = parseFloat(str);
    if (num < 0)
      return 0;
    if (num > 1)
      return 255;
    return Math.round(num * 255);
  }
  function parsePercentage(str) {
    const int = parseFloat(str);
    if (int < 0)
      return 0;
    if (int > 100)
      return 1;
    return int / 100;
  }
  function colorToRgba(input) {
    let int32Color = normalizeColor(input);
    if (int32Color === null)
      return input;
    int32Color = int32Color || 0;
    let r = (int32Color & 4278190080) >>> 24;
    let g = (int32Color & 16711680) >>> 16;
    let b = (int32Color & 65280) >>> 8;
    let a = (int32Color & 255) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const stringShapeRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  const colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
  const colorNamesRegex = new RegExp(`(${Object.keys(colors).join("|")})`, "g");
  function createInterpolation(config2) {
    const outputRange = config2.output.map((rangeValue) => rangeValue.replace(colorRegex, colorToRgba)).map((rangeValue) => rangeValue.replace(colorNamesRegex, colorToRgba));
    const outputRanges = outputRange[0].match(stringShapeRegex).map(() => []);
    outputRange.forEach((value) => {
      value.match(stringShapeRegex).forEach((number, i) => outputRanges[i].push(+number));
    });
    const interpolations = outputRange[0].match(stringShapeRegex).map((value, i) => {
      return Interpolation.create(_extends$1({}, config2, {
        output: outputRanges[i]
      }));
    });
    return (input) => {
      let i = 0;
      return outputRange[0].replace(stringShapeRegex, () => interpolations[i++](input)).replace(/rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, (_, p1, p2, p3, p4) => `rgba(${Math.round(p1)}, ${Math.round(p2)}, ${Math.round(p3)}, ${p4})`);
    };
  }
  class AnimatedInterpolation extends AnimatedArrayWithChildren {
    constructor(parents, _config, _arg) {
      super();
      this.getValue = () => this.calc(...this.payload.map((value) => value.getValue()));
      this.updateConfig = (config2, arg) => this.calc = Interpolation.create(config2, arg);
      this.interpolate = (config2, arg) => new AnimatedInterpolation(this, config2, arg);
      this.payload = parents instanceof AnimatedArrayWithChildren && !parents.updateConfig ? parents.payload : Array.isArray(parents) ? parents : [parents];
      this.calc = Interpolation.create(_config, _arg);
    }
  }
  const interpolate$1 = (parents, config2, arg) => parents && new AnimatedInterpolation(parents, config2, arg);
  function findAnimatedStyles(node, styles) {
    if (typeof node.update === "function")
      styles.add(node);
    else
      node.getChildren().forEach((child) => findAnimatedStyles(child, styles));
  }
  class AnimatedValue extends AnimatedWithChildren {
    constructor(_value) {
      var _this;
      super();
      _this = this;
      this.setValue = function(value, flush) {
        if (flush === void 0) {
          flush = true;
        }
        _this.value = value;
        if (flush)
          _this.flush();
      };
      this.getValue = () => this.value;
      this.updateStyles = () => findAnimatedStyles(this, this.animatedStyles);
      this.updateValue = (value) => this.flush(this.value = value);
      this.interpolate = (config2, arg) => new AnimatedInterpolation(this, config2, arg);
      this.value = _value;
      this.animatedStyles = new Set();
      this.done = false;
      this.startPosition = _value;
      this.lastPosition = _value;
      this.lastVelocity = void 0;
      this.lastTime = void 0;
      this.controller = void 0;
    }
    flush() {
      if (this.animatedStyles.size === 0)
        this.updateStyles();
      this.animatedStyles.forEach((animatedStyle) => animatedStyle.update());
    }
    prepare(controller) {
      if (this.controller === void 0)
        this.controller = controller;
      if (this.controller === controller) {
        this.startPosition = this.value;
        this.lastPosition = this.value;
        this.lastVelocity = controller.isActive ? this.lastVelocity : void 0;
        this.lastTime = controller.isActive ? this.lastTime : void 0;
        this.done = false;
        this.animatedStyles.clear();
      }
    }
  }
  class AnimatedArray extends AnimatedArrayWithChildren {
    constructor(array) {
      var _this;
      super();
      _this = this;
      this.setValue = function(value, flush) {
        if (flush === void 0) {
          flush = true;
        }
        if (Array.isArray(value)) {
          if (value.length === _this.payload.length)
            value.forEach((v, i) => _this.payload[i].setValue(v, flush));
        } else
          _this.payload.forEach((v, i) => _this.payload[i].setValue(value, flush));
      };
      this.getValue = () => this.payload.map((v) => v.getValue());
      this.interpolate = (config2, arg) => new AnimatedInterpolation(this, config2, arg);
      this.payload = array.map((n) => new AnimatedValue(n));
    }
  }
  function withDefault(value, defaultValue) {
    return value === void 0 || value === null ? defaultValue : value;
  }
  function toArray(a) {
    return a !== void 0 ? Array.isArray(a) ? a : [a] : [];
  }
  function shallowEqual(a, b) {
    if (typeof a !== typeof b)
      return false;
    if (typeof a === "string" || typeof a === "number")
      return a === b;
    let i;
    for (i in a)
      if (!(i in b))
        return false;
    for (i in b)
      if (a[i] !== b[i])
        return false;
    return i === void 0 ? a === b : true;
  }
  function callProp(obj) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return typeof obj === "function" ? obj(...args) : obj;
  }
  function getValues$1(object) {
    return Object.keys(object).map((k) => object[k]);
  }
  function getForwardProps(props) {
    const to = props.to, from = props.from, config2 = props.config, native = props.native, onStart = props.onStart, onRest = props.onRest, onFrame = props.onFrame, children = props.children, reset = props.reset, reverse = props.reverse, force = props.force, immediate = props.immediate, impl = props.impl, inject = props.inject, delay = props.delay, attach = props.attach, destroyed = props.destroyed, interpolateTo2 = props.interpolateTo, autoStart = props.autoStart, ref = props.ref, forward = _objectWithoutPropertiesLoose$1(props, ["to", "from", "config", "native", "onStart", "onRest", "onFrame", "children", "reset", "reverse", "force", "immediate", "impl", "inject", "delay", "attach", "destroyed", "interpolateTo", "autoStart", "ref"]);
    return forward;
  }
  function interpolateTo(props) {
    const forward = getForwardProps(props);
    const rest = Object.keys(props).reduce((a, k) => forward[k] !== void 0 ? a : _extends$1({}, a, {
      [k]: props[k]
    }), {});
    return _extends$1({
      to: forward
    }, rest);
  }
  function convertToAnimatedValue(acc, _ref) {
    let name = _ref[0], value = _ref[1];
    return _extends$1({}, acc, {
      [name]: new (Array.isArray(value) ? AnimatedArray : AnimatedValue)(value)
    });
  }
  function convertValues(props) {
    const from = props.from, to = props.to, native = props.native;
    const allProps = Object.entries(_extends$1({}, from, to));
    return native ? allProps.reduce(convertToAnimatedValue, {}) : _extends$1({}, from, to);
  }
  function handleRef(ref, forward) {
    if (forward) {
      if (typeof forward === "function")
        forward(ref);
      else if (typeof forward === "object") {
        forward.current = ref;
      }
    }
    return ref;
  }
  const check = (value) => value === "auto";
  const overwrite = (width, height) => (acc, _ref) => {
    let name = _ref[0], value = _ref[1];
    return _extends$1({}, acc, {
      [name]: value === "auto" ? ~name.indexOf("height") ? height : width : value
    });
  };
  function fixAuto(props, callback) {
    const from = props.from, to = props.to, children = props.children;
    if (!(getValues$1(to).some(check) || getValues$1(from).some(check)))
      return;
    let element = children(convertValues(props));
    if (!element)
      return;
    if (Array.isArray(element))
      element = {
        type: "div",
        props: {
          children: element
        }
      };
    const elementStyles = element.props.style;
    return React__default.createElement(element.type, _extends$1({
      key: element.key ? element.key : void 0
    }, element.props, {
      style: _extends$1({}, elementStyles, {
        position: "absolute",
        visibility: "hidden"
      }),
      ref: (_ref2) => {
        if (_ref2) {
          let node = ReactDOM.findDOMNode(_ref2);
          let width, height;
          let cs = getComputedStyle(node);
          if (cs.boxSizing === "border-box") {
            width = node.offsetWidth;
            height = node.offsetHeight;
          } else {
            const paddingX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
            const paddingY = parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);
            const borderX = parseFloat(cs.borderLeftWidth || 0) + parseFloat(cs.borderRightWidth || 0);
            const borderY = parseFloat(cs.borderTopWidth || 0) + parseFloat(cs.borderBottomWidth || 0);
            width = node.offsetWidth - paddingX - borderX;
            height = node.offsetHeight - paddingY - borderY;
          }
          const convert = overwrite(width, height);
          callback(_extends$1({}, props, {
            from: Object.entries(from).reduce(convert, from),
            to: Object.entries(to).reduce(convert, to)
          }));
        }
      }
    }));
  }
  let isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  };
  const prefixKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.substring(1);
  const prefixes = ["Webkit", "Ms", "Moz", "O"];
  isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
    prefixes.forEach((prefix) => acc[prefixKey(prefix, prop)] = acc[prop]);
    return acc;
  }, isUnitlessNumber);
  function dangerousStyleValue(name, value, isCustomProperty) {
    if (value == null || typeof value === "boolean" || value === "")
      return "";
    if (!isCustomProperty && typeof value === "number" && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]))
      return value + "px";
    return ("" + value).trim();
  }
  const attributeCache = {};
  injectCreateAnimatedStyle((style) => new AnimatedStyle(style));
  injectDefaultElement("div");
  injectInterpolation(createInterpolation);
  injectColorNames(colors);
  injectBugfixes(fixAuto);
  injectApplyAnimatedValues((instance, props) => {
    if (instance.nodeType && instance.setAttribute !== void 0) {
      const style = props.style, children = props.children, scrollTop = props.scrollTop, scrollLeft = props.scrollLeft, attributes = _objectWithoutPropertiesLoose$1(props, ["style", "children", "scrollTop", "scrollLeft"]);
      if (scrollTop !== void 0)
        instance.scrollTop = scrollTop;
      if (scrollLeft !== void 0)
        instance.scrollLeft = scrollLeft;
      if (children !== void 0)
        instance.textContent = children;
      for (let styleName in style) {
        if (!style.hasOwnProperty(styleName))
          continue;
        var isCustomProperty = styleName.indexOf("--") === 0;
        var styleValue = dangerousStyleValue(styleName, style[styleName], isCustomProperty);
        if (styleName === "float")
          styleName = "cssFloat";
        if (isCustomProperty)
          instance.style.setProperty(styleName, styleValue);
        else
          instance.style[styleName] = styleValue;
      }
      for (let name in attributes) {
        const dashCase = attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, (n) => "-" + n.toLowerCase()));
        if (typeof instance.getAttribute(dashCase) !== "undefined")
          instance.setAttribute(dashCase, attributes[name]);
      }
    } else
      return false;
  }, (style) => style);
  let active = false;
  const controllers = new Set();
  const frameLoop = () => {
    let time = now();
    for (let controller of controllers) {
      let isDone = true;
      let noChange = true;
      for (let configIdx = 0; configIdx < controller.configs.length; configIdx++) {
        let config2 = controller.configs[configIdx];
        let endOfAnimation, lastTime;
        for (let valIdx = 0; valIdx < config2.animatedValues.length; valIdx++) {
          let animation = config2.animatedValues[valIdx];
          if (animation.done)
            continue;
          let from = config2.fromValues[valIdx];
          let to = config2.toValues[valIdx];
          let position = animation.lastPosition;
          let isAnimated = to instanceof Animated;
          let velocity = Array.isArray(config2.initialVelocity) ? config2.initialVelocity[valIdx] : config2.initialVelocity;
          if (isAnimated)
            to = to.getValue();
          if (config2.immediate || !isAnimated && !config2.decay && from === to) {
            animation.updateValue(to);
            animation.done = true;
            continue;
          }
          if (config2.delay && time - controller.startTime < config2.delay) {
            isDone = false;
            continue;
          }
          noChange = false;
          if (typeof from === "string" || typeof to === "string") {
            animation.updateValue(to);
            animation.done = true;
            continue;
          }
          if (config2.duration !== void 0) {
            position = from + config2.easing((time - controller.startTime - config2.delay) / config2.duration) * (to - from);
            endOfAnimation = time >= controller.startTime + config2.delay + config2.duration;
          } else if (config2.decay) {
            position = from + velocity / (1 - 0.998) * (1 - Math.exp(-(1 - 0.998) * (time - controller.startTime)));
            endOfAnimation = Math.abs(animation.lastPosition - position) < 0.1;
            if (endOfAnimation)
              to = position;
          } else {
            lastTime = animation.lastTime !== void 0 ? animation.lastTime : time;
            velocity = animation.lastVelocity !== void 0 ? animation.lastVelocity : config2.initialVelocity;
            if (time > lastTime + 64)
              lastTime = time;
            let numSteps = Math.floor(time - lastTime);
            for (let i = 0; i < numSteps; ++i) {
              let force = -config2.tension * (position - to);
              let damping = -config2.friction * velocity;
              let acceleration = (force + damping) / config2.mass;
              velocity = velocity + acceleration * 1 / 1e3;
              position = position + velocity * 1 / 1e3;
            }
            let isOvershooting = config2.clamp && config2.tension !== 0 ? from < to ? position > to : position < to : false;
            let isVelocity = Math.abs(velocity) <= config2.precision;
            let isDisplacement = config2.tension !== 0 ? Math.abs(to - position) <= config2.precision : true;
            endOfAnimation = isOvershooting || isVelocity && isDisplacement;
            animation.lastVelocity = velocity;
            animation.lastTime = time;
          }
          if (isAnimated && !config2.toValues[valIdx].done)
            endOfAnimation = false;
          if (endOfAnimation) {
            if (animation.value !== to)
              position = to;
            animation.done = true;
          } else
            isDone = false;
          animation.updateValue(position);
          animation.lastPosition = position;
        }
        if (controller.props.onFrame || !controller.props.native)
          controller.animatedProps[config2.name] = config2.interpolation.getValue();
      }
      if (controller.props.onFrame || !controller.props.native) {
        if (!controller.props.native && controller.onUpdate)
          controller.onUpdate();
        if (controller.props.onFrame)
          controller.props.onFrame(controller.animatedProps);
      }
      if (isDone) {
        controllers.delete(controller);
        controller.debouncedOnEnd({
          finished: true,
          noChange
        });
      }
    }
    if (controllers.size)
      requestFrame(frameLoop);
    else
      active = false;
  };
  const addController = (controller) => {
    if (!controllers.has(controller)) {
      controllers.add(controller);
      if (!active)
        requestFrame(frameLoop);
      active = true;
    }
  };
  const removeController = (controller) => {
    if (controllers.has(controller)) {
      controllers.delete(controller);
    }
  };
  class Controller {
    constructor(props, config2) {
      if (config2 === void 0) {
        config2 = {
          native: true,
          interpolateTo: true,
          autoStart: true
        };
      }
      this.getValues = () => this.props.native ? this.interpolations : this.animatedProps;
      this.dependents = new Set();
      this.isActive = false;
      this.hasChanged = false;
      this.props = {};
      this.merged = {};
      this.animations = {};
      this.interpolations = {};
      this.animatedProps = {};
      this.configs = [];
      this.frame = void 0;
      this.startTime = void 0;
      this.lastTime = void 0;
      this.update(_extends$1({}, props, config2));
    }
    update(props) {
      this.props = _extends$1({}, this.props, props);
      let _ref = this.props.interpolateTo ? interpolateTo(this.props) : this.props, _ref$from = _ref.from, from = _ref$from === void 0 ? {} : _ref$from, _ref$to = _ref.to, to = _ref$to === void 0 ? {} : _ref$to, _ref$config = _ref.config, config2 = _ref$config === void 0 ? {} : _ref$config, _ref$delay = _ref.delay, delay = _ref$delay === void 0 ? 0 : _ref$delay, reverse = _ref.reverse, attach = _ref.attach, reset = _ref.reset, immediate = _ref.immediate, autoStart = _ref.autoStart, ref = _ref.ref;
      if (reverse) {
        var _ref2 = [to, from];
        from = _ref2[0];
        to = _ref2[1];
      }
      this.hasChanged = false;
      let target = attach && attach(this);
      let extra = reset ? {} : this.merged;
      this.merged = _extends$1({}, from, extra, to);
      this.animations = Object.entries(this.merged).reduce((acc, _ref3, i) => {
        let name = _ref3[0], value = _ref3[1];
        let entry = !reset && acc[name] || {};
        const isNumber = typeof value === "number";
        const isString = typeof value === "string" && !value.startsWith("#") && !/\d/.test(value) && !colorNames[value];
        const isArray = !isNumber && !isString && Array.isArray(value);
        let fromValue = from[name] !== void 0 ? from[name] : value;
        let toValue = isNumber || isArray ? value : isString ? value : 1;
        let toConfig = callProp(config2, name);
        if (target)
          toValue = target.animations[name].parent;
        if (toConfig.decay !== void 0 || !shallowEqual(entry.changes, value)) {
          this.hasChanged = true;
          let parent, interpolation$$1;
          if (isNumber || isString)
            parent = interpolation$$1 = entry.parent || new AnimatedValue(fromValue);
          else if (isArray)
            parent = interpolation$$1 = entry.parent || new AnimatedArray(fromValue);
          else {
            const prev = entry.interpolation && entry.interpolation.calc(entry.parent.value);
            if (entry.parent) {
              parent = entry.parent;
              parent.setValue(0, false);
            } else
              parent = new AnimatedValue(0);
            const range = {
              output: [prev !== void 0 ? prev : fromValue, value]
            };
            if (entry.interpolation) {
              interpolation$$1 = entry.interpolation;
              entry.interpolation.updateConfig(range);
            } else
              interpolation$$1 = parent.interpolate(range);
          }
          if (callProp(immediate, name))
            parent.setValue(value, false);
          const animatedValues = toArray(parent.getPayload());
          animatedValues.forEach((value2) => value2.prepare(this));
          return _extends$1({}, acc, {
            [name]: _extends$1({}, entry, {
              name,
              parent,
              interpolation: interpolation$$1,
              animatedValues,
              changes: value,
              fromValues: toArray(parent.getValue()),
              toValues: toArray(target ? toValue.getPayload() : toValue),
              immediate: callProp(immediate, name),
              delay: withDefault(toConfig.delay, delay || 0),
              initialVelocity: withDefault(toConfig.velocity, 0),
              clamp: withDefault(toConfig.clamp, false),
              precision: withDefault(toConfig.precision, 0.01),
              tension: withDefault(toConfig.tension, 170),
              friction: withDefault(toConfig.friction, 26),
              mass: withDefault(toConfig.mass, 1),
              duration: toConfig.duration,
              easing: withDefault(toConfig.easing, (t) => t),
              decay: toConfig.decay
            })
          });
        } else
          return acc;
      }, this.animations);
      if (this.hasChanged) {
        this.configs = getValues$1(this.animations);
        this.animatedProps = {};
        this.interpolations = {};
        for (let key in this.animations) {
          this.interpolations[key] = this.animations[key].interpolation;
          this.animatedProps[key] = this.animations[key].interpolation.getValue();
        }
      }
      for (var _len = arguments.length, start = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        start[_key - 1] = arguments[_key];
      }
      if (!ref && (autoStart || start.length))
        this.start(...start);
      const onEnd = start[0], onUpdate = start[1];
      this.onEnd = typeof onEnd === "function" && onEnd;
      this.onUpdate = onUpdate;
      return this.getValues();
    }
    start(onEnd, onUpdate) {
      this.startTime = now();
      if (this.isActive)
        this.stop();
      this.isActive = true;
      this.onEnd = typeof onEnd === "function" && onEnd;
      this.onUpdate = onUpdate;
      if (this.props.onStart)
        this.props.onStart();
      addController(this);
      return new Promise((res) => this.resolve = res);
    }
    stop(finished) {
      if (finished === void 0) {
        finished = false;
      }
      if (finished)
        getValues$1(this.animations).forEach((a) => a.changes = void 0);
      this.debouncedOnEnd({
        finished
      });
    }
    destroy() {
      removeController(this);
      this.props = {};
      this.merged = {};
      this.animations = {};
      this.interpolations = {};
      this.animatedProps = {};
      this.configs = [];
    }
    debouncedOnEnd(result) {
      removeController(this);
      this.isActive = false;
      const onEnd = this.onEnd;
      this.onEnd = null;
      if (onEnd)
        onEnd(result);
      if (this.resolve)
        this.resolve();
      this.resolve = null;
    }
  }
  class AnimatedProps extends AnimatedObjectWithChildren {
    constructor(props, callback) {
      super();
      if (props.style)
        props = _extends$1({}, props, {
          style: createAnimatedStyle(props.style)
        });
      this.payload = props;
      this.update = callback;
      this.attach();
    }
  }
  function createAnimatedComponent(Component) {
    class AnimatedComponent extends React__default.Component {
      constructor(props) {
        super();
        this.callback = () => {
          if (this.node) {
            const didUpdate = applyAnimatedValues.fn(this.node, this.propsAnimated.getAnimatedValue(), this);
            if (didUpdate === false)
              this.forceUpdate();
          }
        };
        this.attachProps(props);
      }
      componentWillUnmount() {
        this.propsAnimated && this.propsAnimated.detach();
      }
      setNativeProps(props) {
        const didUpdate = applyAnimatedValues.fn(this.node, props, this);
        if (didUpdate === false)
          this.forceUpdate();
      }
      attachProps(_ref) {
        let forwardRef = _ref.forwardRef, nextProps = _objectWithoutPropertiesLoose$1(_ref, ["forwardRef"]);
        const oldPropsAnimated = this.propsAnimated;
        this.propsAnimated = new AnimatedProps(nextProps, this.callback);
        oldPropsAnimated && oldPropsAnimated.detach();
      }
      shouldComponentUpdate(props) {
        const style = props.style, nextProps = _objectWithoutPropertiesLoose$1(props, ["style"]);
        const _this$props = this.props, currentStyle = _this$props.style, currentProps = _objectWithoutPropertiesLoose$1(_this$props, ["style"]);
        if (!shallowEqual(currentProps, nextProps) || !shallowEqual(currentStyle, style)) {
          this.attachProps(props);
          return true;
        }
        return false;
      }
      render() {
        const _this$propsAnimated$g = this.propsAnimated.getValue(), scrollTop = _this$propsAnimated$g.scrollTop, scrollLeft = _this$propsAnimated$g.scrollLeft, animatedProps = _objectWithoutPropertiesLoose$1(_this$propsAnimated$g, ["scrollTop", "scrollLeft"]);
        return React__default.createElement(Component, _extends$1({}, animatedProps, {
          ref: (node) => this.node = handleRef(node, this.props.forwardRef)
        }));
      }
    }
    return React__default.forwardRef((props, ref) => React__default.createElement(AnimatedComponent, _extends$1({}, props, {
      forwardRef: ref
    })));
  }
  const config = {
    default: {
      tension: 170,
      friction: 26
    },
    gentle: {
      tension: 120,
      friction: 14
    },
    wobbly: {
      tension: 180,
      friction: 12
    },
    stiff: {
      tension: 210,
      friction: 20
    },
    slow: {
      tension: 280,
      friction: 60
    },
    molasses: {
      tension: 280,
      friction: 120
    }
  };
  class Spring2 extends React__default.Component {
    constructor() {
      super(...arguments);
      this.state = {
        lastProps: {
          from: {},
          to: {}
        },
        propsChanged: false,
        internal: false
      };
      this.controller = new Controller(null, null);
      this.didUpdate = false;
      this.didInject = false;
      this.finished = true;
      this.start = () => {
        this.finished = false;
        let wasMounted = this.mounted;
        this.controller.start((props) => this.finish(_extends$1({}, props, {
          wasMounted
        })), this.update);
      };
      this.stop = () => this.controller.stop(true);
      this.update = () => this.mounted && this.setState({
        internal: true
      });
      this.finish = (_ref) => {
        let finished = _ref.finished, noChange = _ref.noChange, wasMounted = _ref.wasMounted;
        this.finished = true;
        if (this.mounted && finished) {
          if (this.props.onRest && (wasMounted || !noChange))
            this.props.onRest(this.controller.merged);
          if (this.mounted && this.didInject) {
            this.afterInject = convertValues(this.props);
            this.setState({
              internal: true
            });
          }
          if (this.mounted && (this.didInject || this.props.after))
            this.setState({
              internal: true
            });
          this.didInject = false;
        }
      };
    }
    componentDidMount() {
      this.componentDidUpdate();
      this.mounted = true;
    }
    componentWillUnmount() {
      this.mounted = false;
      this.stop();
    }
    static getDerivedStateFromProps(props, _ref2) {
      let internal = _ref2.internal, lastProps = _ref2.lastProps;
      const from = props.from, to = props.to, reset = props.reset, force = props.force;
      const propsChanged = !shallowEqual(to, lastProps.to) || !shallowEqual(from, lastProps.from) || reset && !internal || force && !internal;
      return {
        propsChanged,
        lastProps: props,
        internal: false
      };
    }
    render() {
      const children = this.props.children;
      const propsChanged = this.state.propsChanged;
      if (this.props.inject && propsChanged && !this.injectProps) {
        const frame = this.props.inject(this.props, (injectProps) => {
          this.injectProps = injectProps;
          this.setState({
            internal: true
          });
        });
        if (frame)
          return frame;
      }
      if (this.injectProps || propsChanged) {
        this.didInject = false;
        if (this.injectProps) {
          this.controller.update(this.injectProps);
          this.didInject = true;
        } else if (propsChanged)
          this.controller.update(this.props);
        this.didUpdate = true;
        this.afterInject = void 0;
        this.injectProps = void 0;
      }
      let values = _extends$1({}, this.controller.getValues(), this.afterInject);
      if (this.finished)
        values = _extends$1({}, values, this.props.after);
      return Object.keys(values).length ? children(values) : null;
    }
    componentDidUpdate() {
      if (this.didUpdate)
        this.start();
      this.didUpdate = false;
    }
  }
  Spring2.defaultProps = {
    from: {},
    to: {},
    config: config.default,
    native: false,
    immediate: false,
    reset: false,
    force: false,
    inject: bugfixes
  };
  class Trail extends React__default.PureComponent {
    constructor() {
      super(...arguments);
      this.first = true;
      this.instances = new Set();
      this.hook = (instance, index, length, reverse) => {
        this.instances.add(instance);
        if (reverse ? index === length - 1 : index === 0)
          return void 0;
        else
          return Array.from(this.instances)[reverse ? index + 1 : index - 1];
      };
    }
    render() {
      const _this$props = this.props, items = _this$props.items, _children = _this$props.children, _this$props$from = _this$props.from, from = _this$props$from === void 0 ? {} : _this$props$from, initial = _this$props.initial, reverse = _this$props.reverse, keys = _this$props.keys, delay = _this$props.delay, onRest = _this$props.onRest, props = _objectWithoutPropertiesLoose$1(_this$props, ["items", "children", "from", "initial", "reverse", "keys", "delay", "onRest"]);
      const array = toArray(items);
      return toArray(array).map((item, i) => React__default.createElement(Spring2, _extends$1({
        onRest: i === 0 ? onRest : null,
        key: typeof keys === "function" ? keys(item) : toArray(keys)[i],
        from: this.first && initial !== void 0 ? initial || {} : from
      }, props, {
        delay: i === 0 && delay || void 0,
        attach: (instance) => this.hook(instance, i, array.length, reverse),
        children: (props2) => {
          const child = _children(item, i);
          return child ? child(props2) : null;
        }
      })));
    }
    componentDidUpdate(prevProps) {
      this.first = false;
      if (prevProps.items !== this.props.items)
        this.instances.clear();
    }
  }
  Trail.defaultProps = {
    keys: (item) => item
  };
  const DEFAULT = "__default";
  class KeyframesImpl extends React__default.PureComponent {
    constructor() {
      var _this;
      super(...arguments);
      _this = this;
      this.guid = 0;
      this.state = {
        props: {},
        resolve: () => null,
        last: true,
        index: 0
      };
      this.next = function(props, last, index) {
        if (last === void 0) {
          last = true;
        }
        if (index === void 0) {
          index = 0;
        }
        _this.running = true;
        return new Promise((resolve) => {
          _this.mounted && _this.setState((state) => ({
            props,
            resolve,
            last,
            index
          }), () => _this.running = false);
        });
      };
    }
    componentDidMount() {
      this.mounted = true;
      this.componentDidUpdate({});
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    componentDidUpdate(previous) {
      var _this2 = this;
      const _this$props = this.props, states = _this$props.states, f = _this$props.filter, state = _this$props.state;
      if (previous.state !== this.props.state || this.props.reset && !this.running || !shallowEqual(states[state], previous.states[previous.state])) {
        if (states && state && states[state]) {
          const localId = ++this.guid;
          const slots = states[state];
          if (slots) {
            if (Array.isArray(slots)) {
              let q = Promise.resolve();
              for (let i = 0; i < slots.length; i++) {
                let index = i;
                let slot = slots[index];
                let last = index === slots.length - 1;
                q = q.then(() => localId === this.guid && this.next(f(slot), last, index));
              }
            } else if (typeof slots === "function") {
              let index = 0;
              slots(function(props, last) {
                if (last === void 0) {
                  last = false;
                }
                return localId === _this2.guid && _this2.next(f(props), last, index++);
              }, () => requestFrame(() => this.instance && this.instance.stop()), this.props);
            } else {
              this.next(f(states[state]));
            }
          }
        }
      }
    }
    render() {
      const _this$state = this.state, props = _this$state.props, resolve = _this$state.resolve, last = _this$state.last, index = _this$state.index;
      if (!props || Object.keys(props).length === 0)
        return null;
      let _this$props2 = this.props, state = _this$props2.state, filter = _this$props2.filter, states = _this$props2.states, config2 = _this$props2.config, Component = _this$props2.primitive, _onRest = _this$props2.onRest, forwardRef = _this$props2.forwardRef, rest = _objectWithoutPropertiesLoose$1(_this$props2, ["state", "filter", "states", "config", "primitive", "onRest", "forwardRef"]);
      if (Array.isArray(config2))
        config2 = config2[index];
      return React__default.createElement(Component, _extends$1({
        ref: (_ref) => this.instance = handleRef(_ref, forwardRef),
        config: config2
      }, rest, props, {
        onRest: (args) => {
          resolve(args);
          if (_onRest && last)
            _onRest(args);
        }
      }));
    }
  }
  KeyframesImpl.defaultProps = {
    state: DEFAULT
  };
  const Keyframes = React__default.forwardRef((props, ref) => React__default.createElement(KeyframesImpl, _extends$1({}, props, {
    forwardRef: ref
  })));
  Keyframes.create = (primitive) => function(states, filter) {
    if (filter === void 0) {
      filter = (states2) => states2;
    }
    if (typeof states === "function" || Array.isArray(states))
      states = {
        [DEFAULT]: states
      };
    return (props) => React__default.createElement(KeyframesImpl, _extends$1({
      primitive,
      states,
      filter
    }, props));
  };
  Keyframes.Spring = (states) => Keyframes.create(Spring2)(states, interpolateTo);
  Keyframes.Trail = (states) => Keyframes.create(Trail)(states, interpolateTo);
  let guid = 0;
  let get = (props) => {
    let items = props.items, keys = props.keys, rest = _objectWithoutPropertiesLoose$1(props, ["items", "keys"]);
    items = toArray(items !== void 0 ? items : null);
    keys = typeof keys === "function" ? items.map(keys) : toArray(keys);
    return _extends$1({
      items,
      keys: keys.map((key) => String(key))
    }, rest);
  };
  class Transition extends React__default.PureComponent {
    componentDidMount() {
      this.mounted = true;
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    constructor(prevProps) {
      super(prevProps);
      this.destroyItem = (item, key, state) => (values) => {
        const _this$props = this.props, onRest = _this$props.onRest, onDestroyed = _this$props.onDestroyed;
        if (this.mounted) {
          onDestroyed && onDestroyed(item);
          this.setState((_ref) => {
            let deleted = _ref.deleted;
            return {
              deleted: deleted.filter((t) => t.key !== key)
            };
          });
          onRest && onRest(item, state, values);
        }
      };
      this.state = {
        first: true,
        transitions: [],
        current: {},
        deleted: [],
        prevProps
      };
    }
    static getDerivedStateFromProps(props, _ref2) {
      let first = _ref2.first, prevProps = _ref2.prevProps, state = _objectWithoutPropertiesLoose$1(_ref2, ["first", "prevProps"]);
      let _get = get(props), items = _get.items, keys = _get.keys, initial = _get.initial, from = _get.from, enter = _get.enter, leave = _get.leave, update = _get.update, _get$trail = _get.trail, trail = _get$trail === void 0 ? 0 : _get$trail, unique = _get.unique, config2 = _get.config;
      let _get2 = get(prevProps), _keys = _get2.keys, _items = _get2.items;
      let current = _extends$1({}, state.current);
      let deleted = [...state.deleted];
      let currentKeys = Object.keys(current);
      let currentSet = new Set(currentKeys);
      let nextSet = new Set(keys);
      let added = keys.filter((item) => !currentSet.has(item));
      let removed = state.transitions.filter((item) => !item.destroyed && !nextSet.has(item.originalKey)).map((i) => i.originalKey);
      let updated = keys.filter((item) => currentSet.has(item));
      let delay = 0;
      added.forEach((key) => {
        if (unique && deleted.find((d) => d.originalKey === key))
          deleted = deleted.filter((t) => t.originalKey !== key);
        const keyIndex = keys.indexOf(key);
        const item = items[keyIndex];
        const state2 = "enter";
        current[key] = {
          state: state2,
          originalKey: key,
          key: unique ? String(key) : guid++,
          item,
          trail: delay = delay + trail,
          config: callProp(config2, item, state2),
          from: callProp(first ? initial !== void 0 ? initial || {} : from : from, item),
          to: callProp(enter, item)
        };
      });
      removed.forEach((key) => {
        const keyIndex = _keys.indexOf(key);
        const item = _items[keyIndex];
        const state2 = "leave";
        deleted.push(_extends$1({}, current[key], {
          state: state2,
          destroyed: true,
          left: _keys[Math.max(0, keyIndex - 1)],
          right: _keys[Math.min(_keys.length, keyIndex + 1)],
          trail: delay = delay + trail,
          config: callProp(config2, item, state2),
          to: callProp(leave, item)
        }));
        delete current[key];
      });
      updated.forEach((key) => {
        const keyIndex = keys.indexOf(key);
        const item = items[keyIndex];
        const state2 = "update";
        current[key] = _extends$1({}, current[key], {
          item,
          state: state2,
          trail: delay = delay + trail,
          config: callProp(config2, item, state2),
          to: callProp(update, item)
        });
      });
      let out = keys.map((key) => current[key]);
      deleted.forEach((_ref3) => {
        let left = _ref3.left, right = _ref3.right, transition = _objectWithoutPropertiesLoose$1(_ref3, ["left", "right"]);
        let pos;
        if ((pos = out.findIndex((t) => t.originalKey === left)) !== -1)
          pos += 1;
        if (pos === -1)
          pos = out.findIndex((t) => t.originalKey === right);
        if (pos === -1)
          pos = deleted.findIndex((t) => t.originalKey === left);
        if (pos === -1)
          pos = deleted.findIndex((t) => t.originalKey === right);
        pos = Math.max(0, pos);
        out = [...out.slice(0, pos), transition, ...out.slice(pos)];
      });
      return {
        first: first && added.length === 0,
        transitions: out,
        current,
        deleted,
        prevProps: props
      };
    }
    render() {
      const _this$props2 = this.props, initial = _this$props2.initial, _this$props2$from = _this$props2.from, _this$props2$enter = _this$props2.enter, _this$props2$leave = _this$props2.leave, _this$props2$update = _this$props2.update, onDestroyed = _this$props2.onDestroyed, keys = _this$props2.keys, items = _this$props2.items, onFrame = _this$props2.onFrame, onRest = _this$props2.onRest, onStart = _this$props2.onStart, trail = _this$props2.trail, config2 = _this$props2.config, _children = _this$props2.children, unique = _this$props2.unique, reset = _this$props2.reset, extra = _objectWithoutPropertiesLoose$1(_this$props2, ["initial", "from", "enter", "leave", "update", "onDestroyed", "keys", "items", "onFrame", "onRest", "onStart", "trail", "config", "children", "unique", "reset"]);
      return this.state.transitions.map((_ref4, i) => {
        let state = _ref4.state, key = _ref4.key, item = _ref4.item, from = _ref4.from, to = _ref4.to, trail2 = _ref4.trail, config3 = _ref4.config, destroyed = _ref4.destroyed;
        return React__default.createElement(Keyframes, _extends$1({
          reset: reset && state === "enter",
          primitive: Spring2,
          state,
          filter: interpolateTo,
          states: {
            [state]: to
          },
          key,
          onRest: destroyed ? this.destroyItem(item, key, state) : onRest && ((values) => onRest(item, state, values)),
          onStart: onStart && (() => onStart(item, state)),
          onFrame: onFrame && ((values) => onFrame(item, state, values)),
          delay: trail2,
          config: config3
        }, extra, {
          from,
          children: (props) => {
            const child = _children(item, state, i);
            return child ? child(props) : null;
          }
        }));
      });
    }
  }
  Transition.defaultProps = {
    keys: (item) => item,
    unique: false,
    reset: false
  };
  const domElements = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan"
  ];
  const extendedAnimated = domElements.reduce((acc, element) => {
    acc[element] = createAnimatedComponent(element);
    return acc;
  }, createAnimatedComponent);
  exports.Spring = Spring2;
  exports.Keyframes = Keyframes;
  exports.Transition = Transition;
  exports.Trail = Trail;
  exports.Controller = Controller;
  exports.config = config;
  exports.animated = extendedAnimated;
  exports.interpolate = interpolate$1;
  exports.Globals = Globals;
});
var Spring = renderprops.Spring;
export {Spring};
