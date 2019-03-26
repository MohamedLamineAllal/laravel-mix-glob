/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./resources/js/easyStyle.js":
/*!***********************************!*\
  !*** ./resources/js/easyStyle.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function EasyStyle(el) {
  this.el = el;
}

(function (p) {
  p.style = function (styl) {
    var properties = Object.keys(styl);
    var property, val;

    for (var i = 0; i < properties.length; i++) {
      property = properties[i];
      val = styl[property];
      this.el.style[property] = val;
    }

    return this;
  };

  p.renewEl = function (el) {
    this.el = el;
    return this;
  };
})(EasyStyle.prototype);

/* harmony default export */ __webpack_exports__["default"] = (EasyStyle);

/***/ }),

/***/ "./resources/js/home.compile.js":
/*!**************************************!*\
  !*** ./resources/js/home.compile.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _innerlo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./innerlo */ "./resources/js/innerlo.js");

$(function () {
  var warningIcon = document.getElementById('warningIcon');
  var alert = new _innerlo__WEBPACK_IMPORTED_MODULE_0__["default"]({
    icon: warningIcon
  }).setDialogBtns("confirm", {
    confirm: {
      className: "btn btn-danger",
      innerHTML: "Confirm",
      events: {
        click: goToPreview // add passing data to click event handler later

      }
    },
    cancel: {
      className: "btn btn-warning",
      innerHTML: "Cancel"
    }
  }).updateText('title', 'Cool your mix is nice, do you want to go to ').renderBtnsAltern('confirm');
});
var goToPreviewBtn = document.getElementById('goToPreviewBtn');
goToPreviewBtn.addEventListener('click', function () {
  alert.cshow();
});

function goToPreview() {
  window.location.href = previewRoute;
}

/***/ }),

/***/ "./resources/js/innerlo.js":
/*!*********************************!*\
  !*** ./resources/js/innerlo.js ***!
  \*********************************/
/*! exports provided: InnerloAlert, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InnerloAlert", function() { return InnerloAlert; });
/* harmony import */ var _easyStyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./easyStyle */ "./resources/js/easyStyle.js");
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(eventemitter3__WEBPACK_IMPORTED_MODULE_1__);



function OutsideEvents() {} // complete all events, one store or one center, queue, perfromant
// force all top (loop through all els zIndex, set something bigger then that)
// lite version (give ease of animation, without all the overiding options, neither the created container)


function InnerloLite() {} // later add no container option [el appended directly]
// add more class state  [or make state and work with state] (infinite number of state dynamic) [each state have there function ] (then easily switch between states)

/**
 * bugs and problems to solves
 * 
 * multi innerlo and click outside (use one prototype click window listener (for innerlo and it's extensions))
 * // undo one innerlo at a time (the last one get first hidden)
 * 
 * // provide hide all (one after another with animation or not ....etc) // some day
 * 
 * 
 * 
 * check your logic for the click handlers (multiple you set)
 * 
 */


function Innerlo(container, el, options) {
  this.el = el;

  if (container === 'parent') {
    this.cc = this.el.parentNode;
  } else {
    this.cc = container;
  }

  this.state = 'init'; // contianer container

  var containerPosition = 'absolute';

  if (!this.cc) {
    this.cc = document.body;
  }

  if (this.cc === document.body) {
    containerPosition = 'fixed';
  } //(find max zIndex, in container) //// (also can be handled from css)


  this.elStyl = new _easyStyle__WEBPACK_IMPORTED_MODULE_0__["default"](this.el);
  this.elStyl.style({
    zIndex: this.topZIndex,
    pointerEvents: 'initial'
  });
  this.container = document.createElement('div');
  this.cstyl = new _easyStyle__WEBPACK_IMPORTED_MODULE_0__["default"](this.container);
  this.cstyl.style({
    width: '100%',
    height: '100%',
    position: containerPosition,
    top: 0,
    left: 0,
    overflow: 'hidden',
    // add options to set that to not that (that just the default, to avoid problem, but if you need not to have that, then an option will do it. case scenario (i want overflow, and i will set the hidden overflow, in another container))
    transition: 'all 400ms ease',
    background: 'transparent'
  });
  console.log(this.cc);
  this.cc.appendChild(this.container); //options.elPosInVirtualContainer
  // positioning will be set conditionally depending on the options
  // need to support multiple type of positioning (absolute, relative, centered, vertical, horizontal, and see how we keep all that with a good animation engine), presets

  this.cstyl.style({
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center'
  });
  this.container.appendChild(this.el);
  this.initCls = null;
  this.outCls = null;
  this.baseCls = null;
  this.elDfltDisplay = 'unset';
  this.containerDfltDisplay = 'flex';
  this.duration = 500; // number or {in: , out: }

  this.delay = 0; // number or {in: , out: }

  this.easing = 'ease';
  this.el.style.transition = 'all ' + this.easing + ' ' + this.duration + 'ms ' + this.delay + 'ms';
  this.clickOutAutoHide = true; // later have stylesheet added by js (add init, in, out classes, each will set transition style, ..etc)  // we separate the prametrisation

  this.containerZIndex = 1000000000; // that's too too big (but you can overide it in options)

  this.outsideClickPropagationStoped = false;
  this.container.className = 'innerlo_container';
  this.showEl = false;

  if (options) {
    if (options.elDfltDisplay) {
      this.elDfltDisplay = options.elDfltDisplay;
    }

    if (options.containerDfltDisplay) {
      this.containerDfltDisplay = options.containerDfltDisplay;
    }

    if (options.initCls) {
      this.initCls = options.initCls;
    }

    if (options.outCls) {
      this.outCls = options.outCls;
    }

    if (options.baseCls) {
      this.baseCls = options.baseCls;
      this.addClass(this.baseCls);
    }

    if (options.backBackground) {
      this.backBackground = options.backBackground;
    }

    if (options.containerZIndex) {
      this.containerZIndex = options.containerZIndex;
    }

    if (options.containerClass) {
      this.container.className += ' ' + options.containerClass;
    }

    if (options.showEl) {
      this.showEl = options.showEl;
    }

    if (typeof options.clickOutAutoHide !== 'undefined') {
      alert('option a' + options.clickOutAutoHide);
      this.clickOutAutoHide = options.clickOutAutoHide;
    }

    if (options.noClickOutHandling) {
      this.noClickOutHandling = options.noClickOutHandling;
    } else {
      this.noClickOutHandling = false;
    }

    if (options.reinsertContainer) {
      this.reinsertContainer = options.reinsertContainer;
    } else {
      this.reinsertContainer = true;
    }

    if (!options.noClickOutHandling) {
      if (options.clickOutsideHandler) {
        this.clickOutsideHandler = options.clickOutsideHandler;
      } else {
        //default value
        this.clickOutsideHandler = function (evt) {
          this.chide(function () {
            execEvtHandler.call(this, 'chideEnd', evt);
          });
        };
      }

      this.clickOutsideHandler = this.clickOutsideHandler.bind(this);
      this.clickOutHandlerSet = false;
      console.log('click out auto hide');
      console.log(this.clickOutAutoHide);

      if (this.clickOutAutoHide) {
        this.clickOutsideActive = false;

        if (Innerlo.prototype.clickListener === null) {
          Innerlo.prototype.clickListener = window.addEventListener('click', function (evt) {
            Innerlo.prototype.eeEmit('windowClickHandler_getit');
            console.log('length clickhand = ', Innerlo.prototype.clickHandlers.length);

            for (var i = 0; i < Innerlo.prototype.clickHandlers.length; i++) {
              Innerlo.prototype.clickHandlers[i](evt);
              console.log('>>>>');
            }
          }); // later add unbined at object distruction
        }

        this.addClickOutHandler();
      }

      if (options.specifiedTexts) {
        this.specifiedTexts = options.specifiedTexts;
      }

      if (options.specifiedEls) {
        this.specifiedEls = options.specifiedEls;
      }

      if (options.contentDefiners) {
        this.contentDefiners = options.contentDefiners;
      }
      /*
      {
          dfinerName: {
              specifiedTexts : {
                  elname: innerHTML_value,
                  .....
              },
              specifiedEls: {
                  elname: innerHTML_value,
                  ......
              },
              ......
          }
      }
      */

    }

    this.cstyl.style({
      zIndex: this.containerZIndex
    });

    if (this.showEl) {
      removeClass(this.el, 'init');
      this.state = 'init';
      this.state = 'shown';
    } else {
      addClass(this.el, 'init'); // alert(this.el.className);
    }
  }

  this.events = {
    onElOutsideClick: this.clickOutsideHandler,
    onContainerOutsideClick: null,
    chideStart: null,
    chideEnd: null,
    cshowStart: null,
    cshowEnd: null
  };
}

(function (p) {
  p.eventEmitter = new eventemitter3__WEBPACK_IMPORTED_MODULE_1___default.a();
  p.topZIndex = 5000; // this value get updated by the biggest last zIndex // each time we show an innerlo, that get rized up. Depending in options (each time check the whole dom tree for zindex. Or jsut do that at init, and then the game is between innerlo. Why when popping several, the new one will get on top of the old one. We can keep rizing that number. or we can keep a list of active innerlo and zindex.) we can keep => base (without innerlo) & innerlo => innerlo add. (this better, two variable will do the trick)

  p.eeOn = function () {
    p.eventEmitter.on.apply(p.eventEmitter, arguments);
  };

  p.eeEmit = function () {
    p.eventEmitter.emit.apply(p.eventEmitter, arguments);
  };

  p.ee = function (prop) {
    // if (prop in p.eventEmitter) { // don't check
    p.eventEmitter[prop].apply(p.eventEmitter, Array.prototype.slice.call(arguments, 1)); // later check if it's a function
    // }
  };

  p.clickListener = null;
  p.clickHandlers = [];

  p.addClickOutHandler = function () {
    // you may restrict the handling to only clicks with a target that have a parent [so the one that get removed from the DOM will not be triggered]  / use stoppropagatioon in other handler (if they remove detach elements)
    if (!this.clickOutHandlerSet) {
      this.clickOutHandlerSet = true;
      console.log('hi theere hi hi hi hi');
      Innerlo.prototype.clickHandlers.push(function (evt) {
        if (this.clickOutsideActive
        /* && evt.target.parentNode !== null*/
        ) {
            // not active don't bother, it get activated at the end of the fist show, deactivted at start of the hide
            if (!isDescendant(this.el, evt.target)) {
              // event happend outside
              if (!this.outsideClickPropagationStoped) {
                execEvtHandler.call(this, 'onElOutsideClick', evt);
                console.log('click outside hide !!!!!!!!hide hidehide');
                console.log(evt.target);
                console.log(this.el);
              }
            }

            if (!isDescendant(this.container, evt.target)) {
              // outside hte container
              if (!this.outsideClickPropagationStoped) {
                execEvtHandler.call(this, 'onContainerOutsideClick', evt);
              }
            }

            this.outsideClickStopPropagation = false; // get it back so it work the next round (this a mean to stop the propagation by the outside handlers)
          }
      }.bind(this));
    }
  };

  p.on = function (evt, handler) {
    if (this.events.hasOwnProperty(evt)) {
      this.events[evt] = handler.bind(this);
    } else {
      throw 'Wrong event name!';
    }

    return this;
  };

  p.outsideClickStopPropagation = function () {
    this.outsideClickPropagationStoped = true;
  };

  p.addClass = function (cls) {
    // a class or an array
    if (this instanceof Innerlo) {
      addClass(this.el, cls);
      return this;
    } else {
      //static 
      addClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
    }
  };

  p.removeClass = function (cls) {
    // a class or an array
    if (this instanceof Innerlo) {
      removeClass(this.el, cls);
      return this;
    } else {
      //static 
      removeClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
    }
  };

  p.toggleClass = function (cls) {
    // a class or an array
    if (this instanceof Innerlo) {
      toggleClass(this.el, cls);
      return this;
    } else {
      //static 
      toggleClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
    }
  };

  p.hasClass = function (cls) {
    if (this instanceof Innerlo) {
      hasClass(this.el, cls);
      return this;
    } else {
      //static 
      hasClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
    }
  };

  p.display = function (valEl, valContainer) {
    if (arguments.length == 1) {
      if (arguments[0]) {
        if (arguments[0] === true) {
          console.log("=======**=============>");
          console.log(this.elDfltDisplay);
          console.log(this.containerDfltDisplay);
          console.log("=======**=============>");
          this.el.style.display = this.elDfltDisplay;
          this.container.style.display = this.containerDfltDisplay;
        } else {
          // if something else then true (we put it like Block, Flex ...etc)
          this.el.style.display = arguments[0];
          this.container.style.display = arguments[0];
        }
      } else {
        this.el.style.display = 'none';
        this.container.style.display = 'none';
      }

      return this;
    } else if (arguments.length == 0) {
      this.el.style.display = 'none';
      this.container.style.display = 'none';
      return this;
    }

    if (valEl) {
      if (valEl === true) {
        this.el.style.display = this.elDfltDisplay;
      } else {
        // if something else then true (we put it like Block, Flex ...etc)
        this.el.style.display = valEl;
      }
    } else {
      this.el.style.display = 'none';
    }

    if (valContainer) {
      if (valContainer === true) {
        this.container.style.display = this.containerDfltDisplay;
      } else {
        // if something else then true (we put it like Block, Flex ...etc)
        this.container.style.display = valContainer;
      }
    } else {
      this.container.style.display = 'none';
    }

    return this;
  };

  p.alert = function (domEl, position) {};

  p.reinsertInContainer = function () {
    if (this.container.parentNode !== this.cc) {
      this.cc.appendChild(this.container);
    }
  };

  p.getState = function () {
    return this.state;
  };

  p.cshow = function (finishedcallback, hiddenClass, showClass) {
    if (this.reinsertContainer) {
      this.reinsertInContainer();
    }

    execEvtHandler.call(this, 'cshowStart');
    setTimeout(function () {
      this.removeClass(this.outCls);
      this.addClass(this.baseCls);
      this.addClass(this.initCls);
      this.display(true);
      setTimeout(function () {
        // better have it an object function, and bind it
        if (this.backBackground) {
          // alert(JSON.stringify(this.backBackground.background))
          this.cstyl.style(this.backBackground); // this.container.style.background = this.backBackground.background
        }

        this.removeClass(this.initCls);
        this.addClass(this.baseCls);
        this.clickOutsideActive = true;

        if (finishedcallback) {
          // if this precised we will nt exec the event handler (you can stay execut it with this.execEvent() method)
          finishedcallback.call(this); // here you can have a function that allow manual execution of the set event handler
          // this within it (your callback) refer to this Innerlo instance
        } else {
          execEvtHandler.call(this, 'cshowEnd');
        }

        this.state = 'shown';
      }.bind(this), 50);
    }.bind(this), this.delay);
    return this;
  };

  p.chide = function (finishedcallback) {
    execEvtHandler.call(this, 'chideStart');
    setTimeout(function () {
      this.clickOutsideActive = false;
      this.addClass(this.outCls);
      this.addClass(this.baseCls);

      if (this.backBackground) {
        this.cstyl.style({
          background: 'transparent'
        });
      }

      setTimeout(function () {
        // better have it an object function, and bind it
        this.display(false);
        this.removeClass(this.outCls);
        this.addClass(this.baseCls);

        if (finishedcallback) {
          finishedcallback.call(this); // here you can have a function that allow manual execution of the set event handler
        } else {
          console.log('=====================================================+++> ');
          execEvtHandler.call(this, 'chideEnd');
        }

        this.state = 'hidden';
      }.bind(this), this.duration);
    }.bind(this), this.delay);
    return this;
  };

  p.execEvtHandler = function (evt) {
    // it allow a manual execution of the set events handlers (you can pass the argument, work with all events)
    console.log(arguments);
    execEvtHandler.call(this, evt, Array.prototype.slice.call(arguments, 1));
  };

  p.cToggleEl = function () {// if() {
    // }
  };

  p.getEl = function () {
    return this.el;
  };
  /**
   * to do: accept object  (test for arguments number and if one then it should be an object!!!)
   */


  p.updateText = function (specifiedFiled, newText) {
    // a dom el we specify in advance (then)
    if (arguments.length === 1) {
      //object provided // later add check here
      var keys = Object.keys(arguments[0]);

      for (var i = 0; i < keys.length; i++) {
        var textFieldName = keys[i];
        var textFieldValue = arguments[0][textFieldName];

        if (this.specifiedTexts.hasOwnProperty(textFieldName)) {
          this.specifiedTexts[textFieldName].innerHTML = textFieldValue;
        } else {
          throw 'Specified text field wasn\'t specified';
        }
      }
    } else if (arguments.length === 2) {
      console.log("this.specifiedTexts = ", this.specifiedTexts);

      if (this.specifiedTexts.hasOwnProperty(specifiedFiled)) {
        this.specifiedTexts[specifiedFiled].innerHTML = newText;
      } else {
        throw 'Specified text field wasn\'t specified';
      }
    } else {
      throw 'NO Argument specified';
    }

    return this;
  }; // add support for transition in text change (don't know if it make sense)


  p.replaceEL = function (specifiedEl, newEl) {
    // add new above the old then remove the old
    if (this.specifiedEls.hasOwnProperty(specifiedEl)) {// this.textFields[specifiedFiled].innerHTML = newText;
      //[flow the same logic as in alter (all the child will be detached, and the new el, will be attached)]
    } else {
      throw 'Specified element field wasn\'t specified';
    }

    return this; // you can chaine
  };

  p.alter = function (definer) {
    // you set in advance definers [set specified text, el, fields ..etc]
    // then you build definers (set them) [then you simply alter with alter easily]
    if (this.contentDefiners.hasOwnProperty(definer)) {
      var defineObj = this.contentDefiners[definer];
      console.log("this content definers = ", this.contentDefiners);

      if (defineObj.hasOwnProperty('specifiedTexts')) {
        var keys = Object.keys(defineObj.specifiedTexts);
        var el;
        var val;

        for (var i = 0; i < keys.length; i++) {
          el = this.specifiedTexts[keys[i]];
          val = defineObj.specifiedTexts[keys[i]];
          el.innerHTML = val;
        }
      }

      if (defineObj.hasOwnProperty('specifiedEls')) {
        var _keys = Object.keys(defineObj.specifiedEls);

        var container;

        var _el;

        for (var _i = 0; _i < _keys.length; _i++) {
          container = this.specifiedEls[_keys[_i]];
          console.log("container = = = == = ", container);
          _el = defineObj.specifiedEls[_keys[_i]];
          console.log("el = = = == = ", _el);
          clearDomNodeInner(container);
          container.appendChild(_el); // for all this to work, your element in the template should be inserted into a container (we wipe the container all childrens and then insert the new one (the container is ment to hold only one element [or it's simpler like that, we can add support for multiple els]))
          //old el is referenced by the definer (so it will still in memory)
        }
      } // {
      //     dfinerName: {
      //         specifiedTexts: {
      //             elname: innerHTML_value,
      //             .....
      //         },
      //         specifiedEls: {
      //             elname:  elToPutOnTheContainer// not that to replace, we
      //             ......
      //         },
      //         ......
      //     }
      // }

    } else {
      throw 'wrong definner !!';
    }

    return this; // to be able to chaine
  };

  p.setEl = function () {};

  p.setContainer = function () {};

  p.extend = function (Cls) {
    Innerlo.prototype;
  };
})(Innerlo.prototype); // add form values show for inputs confirmation before sending


function InnerloAlert(options) {
  if (options) {
    if (options.icon) {
      this.icon = options.icon; // for icon later you set them globaly (prototype) [here] (and have predefined) // play on precedency
    }

    if (options.container) {
      this.container = options.container;
    } else {
      this.container = document.body;
    }
  } // this.icon; later add the svg icon in the code


  this.innerloMessageEl = document.createElement('div');
  this.innerloMessageEl.className = 'innerloMessageEl';
  this.innerloMessageEl_title = document.createElement('h3');
  this.innerloMessageEl_title.className = 'title';
  this.innerloMessageEl_mainMessageContainer = document.createElement('div');
  this.innerloMessageEl_mainMessageContainer.className = 'mainMessageContainer';
  this.innerloMessageEl_mainMessage = document.createElement('p');
  this.innerloMessageEl_mainMessage.className = 'mainMessage';
  this.innerloMessageEl_mainMessageContainer.append(this.innerloMessageEl_mainMessage); // edgeFade_mainMessage = new EdgesFade(innerloMessageEl_mainMessageContainer, {
  //     top: {
  //         height: '20%'
  //     },
  //     bottom: {
  //         height: '20%'
  //     },
  //     maxHeight: '150px'
  // });

  this.innerloMessageEl_topIcon = document.createElement('div');
  this.innerloMessageEl_topIcon.className = 'topIcon';
  this.innerloMessageEl_innerContainer = document.createElement('div');
  this.innerloMessageEl_innerContainer.className = "innerContainer";
  this.innerloMessageEl_topIcon.append(this.icon);
  this.innerloMessageEl_innerContainer.append(this.innerloMessageEl_topIcon, this.innerloMessageEl_title, this.innerloMessageEl_mainMessageContainer);
  this.innerloMessageEl.append(this.innerloMessageEl_innerContainer);
  this.emeStyl = new _easyStyle__WEBPACK_IMPORTED_MODULE_0__["default"](this.innerloMessageEl).style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '60%'
  }); //[to do] make that config personalisable from outside  [create multilevel Object merge]

  this.innerloInst = new Innerlo(this.container, this.innerloMessageEl, {
    initCls: 'up init',
    inCls: 'fade move',
    outCls: 'up out',
    baseCls: 'innerlo fade move up',
    backBackground: {
      background: '#ffffffe6' // background: '#03030333'

    },
    dfltDisplay: 'flex',
    specifiedTexts: {
      title: this.innerloMessageEl_title,
      mainMessage: this.innerloMessageEl_mainMessage
    },
    specifiedEls: {
      topIcon: this.innerloMessageEl_topIcon
    },
    // clickOutAutoHide: false,
    containerClass: 'innerloMessage_container' // contentDefiners: {
    //     alreadyBlocked: {
    //         specifiedTexts: {
    //             h5: 'The company is already blocked',
    //             p: "Don't worry and relax"
    //         },
    //         specifiedEls: {
    //             icon: svgAlreadyBlock
    //         }
    //     },
    //     wrongId: {
    //         specifiedTexts: {
    //             h5: "Company not found",
    //             p: "company id doesn't exist in the db, try to refresh. Or contact a the system maintainers"
    //         },
    //         specifiedEls: {
    //             icon: svgWrongIdBlockCmpny
    //         }
    //     }
    // }

  }).on('cshowStart', function () {
    // you can set that by option (also you can write separatly the on InnerloPrototype function so you can add this to them (by option) so when those events are rewriting (depend on the option, the provided function will get those bellow action binded))
    document.body.style.overflow = 'hidden';
  }).on('chideStart', function () {
    setTimeout(function () {
      document.body.style.overflow = 'auto';
    }, 100);
  });
}

(function (p) {
  var _loop = function _loop(prop) {
    // console.log('prop = ', prop);
    if (typeof Innerlo.prototype[prop] === 'function') {
      // console.log('is a function');
      InnerloAlert.prototype[prop] = function () {
        if (this.innerloInst) {
          this.innerloInst[prop].apply(this.innerloInst, arguments);
        } else {
          Innerlo.prototype[prop].apply(this, arguments);
        }

        return this;
      }; // console.log('InnerloAlert');
      // console.log(InnerloAlert.prototype);

    }
  };

  // extending Innnerlo prototype
  // console.log('exec innerlo alert prototype');
  for (var prop in Innerlo.prototype) {
    _loop(prop);
  }

  p.updateIcon = function (iconDOM) {
    clearDomNodeInner(this.innerloMessageEl_topIcon);
    this.innerloMessageEl_topIcon.appendChild(iconDOM);
    return this;
  }; // add subAlterns (altern define the btns form)
  // subAlterns define in one type, different settings (events, and other things)
  // later maybe we detach and reatach btns containers


  p.setDialogBtns = function (altern, settings) {
    var _this = this;

    if (!this.btnsAlters) {
      this.btnsAlters = {};
    }

    if (!this.activeBtnsAltern) {
      this.activeBtnsAltern = altern;
    }

    this.btnsAlters[altern] = {};
    var alt = this.btnsAlters[altern];

    if (!alt.dialogBtnsContainer) {
      alt.dialogBtnsContainer = document.createElement('div');
      alt.dialogBtnsContainer.className = 'innerlo_dialogBtnsContainer';
      alt.dialogBtnsContainer.style.display = 'none';
      this.innerloMessageEl.append(alt.dialogBtnsContainer);
    }

    var keys = Object.keys(settings);

    var _loop2 = function _loop2(i) {
      var btnName = keys[i];
      var btnSettings = settings[btnName];
      alt[btnName] = {};
      alt[btnName].settings = btnSettings; // you can associate a dom directly

      alt[btnName].dom = btnSettings.dom ? btnSettings.dom : document.createElement(btnSettings.domTag ? btnSettings.domTag : 'div');
      var d = alt[btnName].dom;
      d.className =  true ? ' ' + btnSettings.className : undefined;

      if (btnSettings.innerHTML) {
        d.innerHTML = btnSettings.innerHTML;
      }

      alt[btnName].events = {}; // you could have used settings directly (maybe your need to remove setting copy (we will see))

      if (btnSettings.events) {
        alt[btnName].events = Object.assign(alt[btnName].events, btnSettings.events);
      }

      var ev = alt[btnName].events;
      alt[btnName].eventsHandler = {};

      if (btnName === 'cancel') {
        alt[btnName].prevendDefaultChide = false;
        console.log('cancel hura');

        alt[btnName].eventsHandler['click'] = function (evt) {
          alt[btnName].prevendDefaultChide = false;

          if (alt[btnName].events['click']) {
            alt[btnName].events['click'].call(this, evt);
          } // alert('hi')


          if (!alt[btnName].prevendDefaultChide) {
            // later think about binding this, to be an object that have a function that allow preventing default, plus an object that hold which button in the altern  // not needed it's just cancel
            this.chide();
          }
        }.bind(_this);

        d.addEventListener('click', alt[btnName].eventsHandler['click']); // we will see if we will use events delegation

        var keys3 = Object.keys(ev);
        keys3.splice(keys3.indexOf('click'), 1);

        var _loop3 = function _loop3(_i2) {
          var evName = keys3[_i2]; // let evHandler = ev[evName];

          alt[btnName].eventsHandler[evName] = function (evt) {
            if (alt[btnName].events[evName]) {
              alt[btnName].events[evName].call(this, evt);
            }
          }.bind(_this);

          d.addEventListener(evName, alt[btnName].eventsHandler[evName]); // we will see if we will use events delegation
          // remember when you want to overid an event unbind the old first
        };

        for (var _i2 = 0; _i2 < keys3.length; _i2++) {
          _loop3(_i2);
        }
      } else {
        var keys2 = Object.keys(ev);

        var _loop4 = function _loop4(_i3) {
          var evName = keys2[_i3]; // let evHandler = ev[evName];

          alt[btnName].eventsHandler[evName] = function (evt) {
            if (alt[btnName].events[evName]) {
              alt[btnName].events[evName].call(this, evt);
            }
          }.bind(_this);

          d.addEventListener(evName, alt[btnName].eventsHandler[evName]); // we will see if we will use events delegation
          // remember when you want to overid an event unbind the old first
        };

        for (var _i3 = 0; _i3 < keys2.length; _i3++) {
          _loop4(_i3);
        }
      }

      alt.dialogBtnsContainer.append(d); // append btn dom
    };

    for (var i = 0; i < keys.length; i++) {
      _loop2(i);
    }

    return this;
  };

  p.preventCancelBtnDefault = function () {
    this.btnsAlters[this.activeAltern].cancel.prevendDefaultChide = true;
    return this;
  };

  p.isBtnsAlternRendered = function (altern) {
    return this.btnsAlters[altern].dialogBtnsContainer.style.display !== 'none';
  };

  p.unrenderBtnsAltern = function (altern) {
    this.btnsAlters[altern].dialogBtnsContainer.style.display = 'none';
    return this;
  };

  p.renderBtnsAltern = function (altern) {
    if (!altern) {
      altern = this.altern;
    }

    this.btnsAlters[altern].dialogBtnsContainer.style.display = '';
    return this;
  };

  p.alternBtnsDialogs = function (altern, show) {
    if (this.activeAltern && this.isBtnsAlternRendered(this.activeAltern) && this.activeAltern !== altern) {
      this.unrenderBtnsAltern(this.activeAltern);
    }

    this.activeAltern = altern;

    if (show === true) {
      this.renderBtnsAltern(altern);
    }

    return this;
  };

  p.updateBtnsText = function () {
    if (!this.activeAltern) {
      throw 'No active Altern is set!! You need to set one';
    }

    var updateBtnsObj;

    if (arguments === 2) {
      updateBtnsObj = {};
      updateBtnsObj[arguments[0]] = arguments[1];
    } else {
      updateBtnsObj = arguments[0];
    }

    var keys = Object.keys(updateBtnsObj);
    var alt;

    for (var i = 0; i < keys.length; i++) {
      var btnName = keys[i];
      var text = updateBtnsObj[btnName];
      var _alt = this.btnsAlters[this.activeAltern];

      if (_alt.hasOwnProperty(btnName)) {
        _alt.dom.innerHTML = text;
      } else {
        throw 'Wrong Btn name !!!';
      }
    }

    return this;
  }; //update events handlers  
  //subalterns

})(InnerloAlert.prototype);

function InnerloAlertExtend() {}

function execEvtHandler(evt) {
  // if you like to support multipe events handlers at same time (add remove ...) [array as no arary] ==> then you can develop this to support all of it
  if (this.events[evt] !== null) {
    console.log(arguments);
    this.events[evt].apply(this, Array.prototype.slice.call(arguments, 1)); // the this in the callbacks will point ot innerlo instance
  }
}

function isDescendant(parent, child) {
  var node = child;

  while (node != null) {
    if (node === parent) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
}

function addClass(DOMElement, classes) {
  if (classes) {
    if (typeof classes === 'string') {
      var decompClasses = classes.split(/\s+/);

      for (var i = 0; i < decompClasses.length; i++) {
        var oneClass = decompClasses[i];

        if (!hasClass(DOMElement, oneClass)) {
          DOMElement.className += " " + oneClass;
        }
      }
    } else if (Object.prototype.toString.call(classes) === "[object Array]") {
      for (var _i4 = 0; _i4 < classes.length; _i4++) {
        var _decompClasses = classes[_i4].split(/\s+/);

        for (var j = 0; j < _decompClasses.length; j++) {
          var _oneClass = _decompClasses[j];

          if (!hasClass(DOMElement, _oneClass)) {
            DOMElement.className += " " + _oneClass;
          }
        }
      }
    }

    DOMElement.className = DOMElement.className.trim();
  }
}

function addClassToAll(DOMList, classes) {
  if (!Array.isArray(DOMList)) {
    addClass(DOMList, classes);
  } else {
    for (var i = 0; i < DOMList.length; i++) {
      addClass(DOMList[i], classes);
    }
  }
}

function removeClass(DOMElement, classes) {
  if (classes && typeof DOMElement.className === 'string') {
    var classesInDOMElement = DOMElement.className.split(/\s+/);

    if (typeof classes === 'string') {
      var classesSplit = classes.split(/\s+/);

      if (classesSplit.length > 1) {
        classes = classesSplit;
      }
    }

    removeElementFromArray_Mutate(classesInDOMElement, classes);
    DOMElement.className = classesInDOMElement.join(' ');
  }
}

function removeClassFromAll(DOMList, classes) {
  if (classes) {
    if (typeof DOMList.length != 'undefined') {
      // that way both domlist and array of domel will be treated by this condition
      for (var i = 0; i < DOMList.length; i++) {
        removeClass(DOMList[i], classes);
      }
    } else {
      // otherwise it's a domel
      removeClass(DOMList, classes);
    }
  }
}

function hasClass_ONEtest(DOMElement, classe) {
  if (typeof DOMElement.className === 'string') {
    var allClasses = DOMElement.className.split(/\s+/);

    for (var i = 0; i < allClasses.length; i++) {
      if (allClasses[i].trim() === classe) {
        return true;
      }
    }
  }

  return false;
}

function hasClass(DOMElement, classes) {
  if (classes) {
    if (typeof classes === 'string') {
      return hasClass_ONEtest(DOMElement, classes);
    } else {
      // multiple classes as array
      for (var i = 0; i < classes.length; i++) {
        if (!hasClass_ONEtest(DOMElement, classes[i])) {
          return false;
        }
      }

      return true;
    }
  }
}
/**
 * 
 * @param {dome el to search the classes in } elementDOM 
 * @param {the classes to check against, string or array of classes (strings)} classes 
 * 
 * @return {bool} [true if has one of the provided classes, false otherwise]
 */


function hasOneOfClasses(elementDOM, classes) {
  if (typeof classes === "string") {
    return hasClass_ONEtest(elementDOM, classes);
  } else {
    // array
    for (var i = 0; i < classes.length; i++) {
      if (hasClass_ONEtest(elementDOM, classes[i])) return true;
    }

    return false;
  }
}

function toggleClass(DOMElement, classes) {
  if (typeof classes === 'string') {
    toggleClass_one(DOMElement, classes);
  } else {
    // multiple classes as array
    for (var i = 0; i < classes.length; i++) {
      toggleClass_one(DOMElement, classes[i]);
    }

    return true;
  }
}

function toggleClass_one(DOMElement, classe) {
  if (hasClass_ONEtest(DOMElement, classe)) {
    removeClass(DOMElement, classe);
  } else {
    // don't have it
    addClass(DOMElement, classe);
  }
}

function removeElementFromArray_Mutate(sourceArray, elementsToRemoveArray) {
  if (Object.prototype.toString.call(elementsToRemoveArray) === '[object Array]') {
    for (var i = 0; i < elementsToRemoveArray.length; i++) {
      for (var j = 0; j < sourceArray.length; j++) {
        if (elementsToRemoveArray[i] === sourceArray[j]) {
          sourceArray.splice(j, 1);
          j--; //important whne we splice we don't go to the next element the element come to us
        }
      }
    }
  } else {
    // if not array then a string or number, or object or function or anything else (to test on an array of functions)
    for (var _i5 = 0; _i5 < sourceArray.length; _i5++) {
      if (sourceArray[_i5] === elementsToRemoveArray) {
        sourceArray.splice(_i5, 1);
        _i5--; //when we splice the next element will come to that position. so we need not to move
      }
    }
  }
} // remove dom elements functions


function removeDOMElement(element) {
  var parent = element.parentNode;

  if (parent) {
    parent.removeChild(element);
  }
} // function clearDomNodeInner(DOM_Node) {
//     while (DOM_Node.firstChild) {
//         DOM_Node.removeChild(DOM_Node.firstChild);
//     }
// }


function clearDomNodeInner(DOM_Node) {
  // remove child  (remove the el and give us a ref, the element still live, if it's refrenced by something, and you can reinsert it (better performance))
  while (DOM_Node.lastChild) {
    DOM_Node.removeChild(DOM_Node.lastChild);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Innerlo);

/***/ }),

/***/ "./resources/sass/home.compile.scss":
/*!******************************************!*\
  !*** ./resources/sass/home.compile.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./resources/sass/previewPage/preview.compile.scss":
/*!*********************************************************!*\
  !*** ./resources/sass/previewPage/preview.compile.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./resources/sass/summernote.scss":
/*!****************************************!*\
  !*** ./resources/sass/summernote.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!******************************************************************************************************************************************************************!*\
  !*** multi ./resources/js/home.compile.js ./resources/sass/home.compile.scss ./resources/sass/previewPage/preview.compile.scss ./resources/sass/summernote.scss ***!
  \******************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/coderhero/Documents/coderhero/Dev/git/laravel-mix-glob/test/laravel/resources/js/home.compile.js */"./resources/js/home.compile.js");
__webpack_require__(/*! /home/coderhero/Documents/coderhero/Dev/git/laravel-mix-glob/test/laravel/resources/sass/home.compile.scss */"./resources/sass/home.compile.scss");
__webpack_require__(/*! /home/coderhero/Documents/coderhero/Dev/git/laravel-mix-glob/test/laravel/resources/sass/previewPage/preview.compile.scss */"./resources/sass/previewPage/preview.compile.scss");
module.exports = __webpack_require__(/*! /home/coderhero/Documents/coderhero/Dev/git/laravel-mix-glob/test/laravel/resources/sass/summernote.scss */"./resources/sass/summernote.scss");


/***/ })

/******/ });