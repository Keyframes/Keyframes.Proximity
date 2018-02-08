(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _core = _interopRequireDefault(require("@keyframes/core"));

var _keyframes = _interopRequireDefault(require("../src/keyframes.proximity"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

_core.default.plugin(_keyframes.default);

var $ = function $(selector) {
  return document.querySelectorAll(selector)[0];
};

var blockElem = $('.block');
var bc2 = $('.block-container.bc2').getBoundingClientRect();
var block = new _core.default(blockElem);
var topPosition = {
  top: '20px'
};

_core.default.define([{
  name: 'initiate',
  '0%': {
    top: '-100px'
  },
  '100%': topPosition
}, {
  name: 'makeTheMove',
  '0%': topPosition,
  '100%': {
    top: "".concat(bc2.top - 20, "px")
  }
}]);

window.onload = function () {
  var readyToProximity = false;
  var isMoving = false;
  var directionSwitch = true;
  block.play('initiate 1s ease 0s 1 normal forwards', function () {
    readyToProximity = true;
  });
  block.proximity(function (obj) {
    if (readyToProximity) {
      blockElem.style.boxShadow = "red 0 0 ".concat(0.5 * obj.distancePercentage, "px");
    }
  });
  blockElem.addEventListener('mouseover', function (e) {
    if (!isMoving) {
      isMoving = true;
      var direction = directionSwitch ? 'normal' : 'reverse';
      directionSwitch = !directionSwitch;
      block.reset(function () {
        return block.play("makeTheMove 2s ease 0s 1 ".concat(direction, " forwards"), function () {
          isMoving = false;
        });
      });
    }
  });
};

},{"../src/keyframes.proximity":3,"@keyframes/core":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Keyframes =
/*#__PURE__*/
function () {
  function Keyframes(elem) {
    _classCallCheck(this, Keyframes);

    this.elem = elem;
  }

  _createClass(Keyframes, [{
    key: "isSupported",
    value: function isSupported() {
      return document.body.style.animationName !== undefined;
    }
  }, {
    key: "reset",
    value: function reset(callback) {
      this.elem.style.animationPlayState = 'running';
      this.elem.style.animation = 'none';

      if (callback) {
        setTimeout(callback, 0);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this.elem.style.animationPlayState = 'paused';
    }
  }, {
    key: "resume",
    value: function resume() {
      this.elem.style.animationPlayState = 'running';
    }
  }, {
    key: "play",
    value: function play(frameOptions, callback) {
      var _this = this;

      var animObjToStr = function animObjToStr(obj) {
        var newObj = Object.assign({}, {
          duration: '0s',
          timingFunction: 'ease',
          delay: '0s',
          iterationCount: 1,
          direction: 'normal',
          fillMode: 'forwards'
        }, obj);
        return [newObj.name, newObj.duration, newObj.timingFunction, newObj.delay, newObj.iterationCount, newObj.direction, newObj.fillMode].join(' ');
      };

      var animationcss = '';

      if (frameOptions.constructor === Array) {
        var frameOptionsStrings = [];

        for (var i = 0; i < frameOptions.length; i += 1) {
          frameOptionsStrings.push(typeof frameOptions[i] === 'string' ? frameOptions[i] : animObjToStr(frameOptions[i]));
        }

        animationcss = frameOptionsStrings.join(', ');
      } else if (typeof frameOptions === 'string') {
        animationcss = frameOptions;
      } else {
        animationcss = animObjToStr(frameOptions);
      }

      var addEvent = function addEvent(type, eventCallback) {
        var listenerName = "".concat(type, "Listener");

        _this.elem.removeEventListener(type, _this[listenerName]);

        _this[listenerName] = eventCallback;

        _this.elem.addEventListener(type, _this[listenerName]);
      };

      this.elem.style.animationPlayState = 'running';
      this.elem.style.animation = animationcss;
      this.frameOptions = frameOptions;
      addEvent('animationiteration', callback || frameOptions.complete);
      addEvent('animationend', callback || frameOptions.complete);
    }
  }], [{
    key: "createKeyframeTag",
    value: function createKeyframeTag(id, css) {
      var elem = document.createElement('style');
      elem.innerHTML = css;
      elem.setAttribute('class', 'keyframe-style');
      elem.setAttribute('id', id);
      elem.setAttribute('type', 'text/css');
      document.getElementsByTagName('head')[0].appendChild(elem);
    }
  }, {
    key: "generate",
    value: function generate(frameData) {
      var frameName = frameData.name || '';
      var css = "@keyframes ".concat(frameName, " {");

      for (var key in frameData) {
        if (key !== 'name' && key !== 'media' && key !== 'complete') {
          css += "".concat(key, " {");

          for (var property in frameData[key]) {
            css += "".concat(property, ":").concat(frameData[key][property], ";");
          }

          css += '}';
        }
      }

      if (frameData.media) {
        css = "@media ".concat(frameData.media, "{").concat(css, "}");
      }

      var frameStyle = document.getElementById(frameName);

      if (frameStyle) {
        frameStyle.innerHTML = css;
      } else {
        Keyframes.createKeyframeTag(frameName, css);
      }
    }
  }, {
    key: "define",
    value: function define(frameData) {
      if (frameData.length) {
        for (var i = 0; i < frameData.length; i += 1) {
          this.generate(frameData[i]);
        }
      } else {
        this.generate(frameData);
      }
    }
  }, {
    key: "plugin",
    value: function plugin(pluginFunc) {
      pluginFunc(Keyframes);
    }
  }]);

  return Keyframes;
}();

exports.default = Keyframes;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(Keyframes) {
  Keyframes.prototype.proximity = function (onMove) {
    var _this = this;

    this.onMouseMove = function (e) {
      var mouse = {
        x: e.pageX,
        y: e.pageY
      }; // Target edge

      var target = _this.elem.getBoundingClientRect();

      var targetCenter = {
        x: Math.floor(target.left + target.width / 2),
        y: Math.floor(target.top + target.height / 2)
      };
      var angle = Math.atan2(mouse.y - targetCenter.y, mouse.x - targetCenter.x);
      var cosAngle = Math.abs(Math.cos(angle));
      var sinAngle = Math.abs(Math.sin(angle));
      var magnitude = target.width / 2 * sinAngle <= target.height / 2 * cosAngle ? target.width / 2 / cosAngle : target.height / 2 / sinAngle;
      var targetEdge = {
        x: targetCenter.x + Math.cos(angle) * magnitude,
        y: targetCenter.y + Math.sin(angle) * magnitude
      }; // Viewport edge

      var viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      var viewPortMagnitude = viewport.width / 2 * sinAngle <= viewport.height / 2 * cosAngle ? viewport.width / 2 / cosAngle : viewport.height / 2 / sinAngle;
      var viewPortEdge = {
        x: targetCenter.x + Math.cos(angle) * viewPortMagnitude,
        y: targetCenter.y + Math.sin(angle) * viewPortMagnitude
      }; // Distances

      var calculateDistance = function calculateDistance(vector) {
        var offsets = {
          top: target.top - vector.y,
          right: vector.x - (target.left + target.width),
          bottom: vector.y - (target.top + target.height),
          left: target.left - vector.x
        };
        var dx = Math.pow(Math.max(offsets.left, 0, offsets.right), 2);
        var dy = Math.pow(Math.max(offsets.top, 0, offsets.bottom), 2);
        return Math.sqrt(dx + dy);
      };

      var mouseDistance = calculateDistance(mouse);
      var viewPortDistance = calculateDistance(viewPortEdge);
      var distancePercentage = 100 - Math.round(mouseDistance / viewPortDistance * 100);
      onMove({
        mouse: mouse,
        mouseDistance: mouseDistance,
        viewPortDistance: viewPortDistance,
        distancePercentage: distancePercentage,
        targetEdge: targetEdge,
        viewPortEdge: viewPortEdge,
        collision: !mouseDistance
      });
    };

    window.addEventListener('mousemove', this.onMouseMove);
  };
};

exports.default = _default;

},{}]},{},[1]);
