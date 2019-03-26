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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

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

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/loading-sprite/dist/js/esm/loadingSprite.js":
/*!******************************************************************!*\
  !*** ./node_modules/loading-sprite/dist/js/esm/loadingSprite.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LoadingSprite; });
function LoadingSprite(options) {
    if (!options) options = {};

    this.loaderClass = options.loaderClass ? options.loaderClass : 'sk-cube-grid';
    this.loaderHolder = document.createElement('div');
    this.lhstyl = new EasyStyle(this.loaderHolder);
    this.zIndex = options.zIndex;
    if (!options.zIndex) {
        this.zIndex = 10000000;
    }

    this.backBackground = options.backBackground ? options.backBackground : 'rgba(0,0,0,0.2)';

    this.blackBack = options.blackBack ? true : false;
    this.holderStyle = options.holderStyle;
    this.lhstyl.style(Object.assign({}, {
        'display': 'none',
        'width': '100%',
        'height': '100%',
        "zIndex": this.zIndex,
        "position": 'absolute',
        'top': 0,
        'left': 0,
        'background': this.blackBack ? this.backBackground : 'transparent'
    }, this.holderStyle));

    this.container = options.container ? options.container : document.body;

    this.containerPositionCheck();


    this.loaderWidth = options.loaderWidth ? options.loaderWidth : '100px';
    this.loaderHeight = options.loaderHeight ? options.loaderHeight : '100px';

    this.loaderContainer = document.createElement('div');
    this.lcStyl = new EasyStyle(this.loaderContainer);
    this.lcStyl.style({
        width: this.loaderWidth,
        height: this.loaderHeight,
        position: 'relative',
        objectFit: 'contain',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
    });

    if (options.loaderDOM) {
        this.loader = options.loaderDOM;
    } else {
        this.loader = getLoaderDOM(this.loaderClass);
    }

    this.loader.className = 'loadingSprite-loader ' + this.loader.className;
    this.lStyl = new EasyStyle(this.loader);
    this.lStyl.style({
        width: this.loaderWidth,
        height: this.loaderHeight,
        position: 'relative',
        objectFit: 'contain'
    });
    this.loaderContainer.appendChild(this.loader);
    this.loaderHolder.appendChild(this.loaderContainer);
    this.container.appendChild(this.loaderHolder);
}

(function (p) {
    p.show = function (container) {
        if (container) {
            this.setContainer(container);
        }

        this.lhstyl.style({
            display: 'block'
        });

        return this;
    }

    p.hide = function () {
        this.lhstyl.style({
            display: 'none'
        });
        return this;
    }

    p.setContainer = function (container) {
        this.container = container;
        this.containerPositionCheck();
        this.container.appendChild(this.loaderHolder);
        return this;
    }
    p.containerPositionCheck = function () {
    }
})(LoadingSprite.prototype);

function getLoaderDOM(className) {
    switch (className) {
        case 'sk-cube-grid':
            var container = document.createElement('div');
            container.className = className;
            var cube;
            for (var i = 0; i < 9; i++) {
                cube = document.createElement('div');
                cube.className = 'sk-cube sk-cube' + (i + 1);
                container.appendChild(cube);
            }

            return container;
        case 'sk-folding-cube':
            var container = document.createElement('div');
            container.className = className;
            var cube;

            [
                'sk-cube sk-cube1',
                'sk-cube sk-cube3',
                'sk-cube sk-cube4',
                'sk-cube sk-cube3'
            ].forEach(function (cls) {
                cube = document.createElement('div');
                cube.className = cls;
                container.appendChild(cube);
            });

            return container;
        case 'sk-fading-circle':
            var container = document.createElement('div');
            container.className = className;
            var circle;
            for (var i = 0; i < 12; i++) {
                circle = document.createElement('div');
                circle.className = 'sk-circle sk-circle' + (i + 1);
                container.appendChild(circle);
            }

            return container;
        case 'sk-circle':
            var container = document.createElement('div');
            container.className = className;
            var circle;
            for (var i = 0; i < 12; i++) {
                circle = document.createElement('div');
                circle.className = 'sk-child sk-circle' + (i + 1);
                container.appendChild(circle);
            }

            return container;
        case 'sk-three-bounce':
            var container = document.createElement('div');
            container.className = className
            var circle;
            for (var i = 0; i < 3; i++) {
                circle = document.createElement('div');
                circle.className = 'sk-child sk-bounce' + (i + 1);
                container.appendChild(circle);
            }

            return container;

        case 'sk-chasing-dots':
            var container = document.createElement('div');
            container.className = className
            var circle;
            for (var i = 0; i < 2; i++) {
                circle = document.createElement('div');
                circle.className = 'sk-child sk-dot' + (i + 1);
                container.appendChild(circle);
            }

            return container;
        case 'sk-wandering-cubes':
            var container = document.createElement('div');
            container.className = className
            var cube;
            for (var i = 0; i < 2; i++) {
                cube = document.createElement('div');
                cube.className = 'sk-cube sk-cube' + (i + 1);
                container.appendChild(cube);
            }

            return container;
        case 'sk-wave':
            var container = document.createElement('div');
            container.className = className
            var rect;
            for (var i = 0; i < 5; i++) {
                rect = document.createElement('div');
                rect.className = 'sk-rect sk-rect' + (i + 1);
                container.appendChild(rect);
            }

            return container;
        case 'sk-double-bounce':
            var container = document.createElement('div');
            container.className = className
            var circle;
            for (var i = 0; i < 2; i++) {
                circle = document.createElement('div');
                circle.className = 'sk-child sk-double-bounce' + (i + 1);
                container.appendChild(circle);
            }

            return container;
        case 'sk-rotating-plane':
            var container = document.createElement('div');
            container.className = className;

            return container;
        case 'sk-spinner sk-spinner-pulse':
            var container = document.createElement('div');
            container.className = className

            return container;
    }
}

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
    }

    p.renewEl = function (el) {
        this.el = el;
        return this;
    }
})(EasyStyle.prototype);

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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

/***/ "./resources/js/previewPage/preview.compile.js":
/*!*****************************************************!*\
  !*** ./resources/js/previewPage/preview.compile.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _innerlo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerlo */ "./resources/js/innerlo.js");
/* harmony import */ var _node_modules_loading_sprite_dist_js_esm_loadingSprite_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/loading-sprite/dist/js/esm/loadingSprite.js */ "./node_modules/loading-sprite/dist/js/esm/loadingSprite.js");



$(function () {
  var loader = new _node_modules_loading_sprite_dist_js_esm_loadingSprite_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
    // <---------------------!!!!!!
    // loaderDOM: ,
    loaderClass: 'sk-cube-grid',
    // zIndex: 1000000000,
    blackBack: true // backBackground: 'rgba(0,0,0,0.2)',
    // holderStyle: {
    //     // any style here
    // },
    // container: someComponent,    // loaderWidth: '100px',
    // loaderHeight: '100px',
    // loaderWidth: '100px',
    // loaderHeight: '100px',

  });
  var writeNoteSummernote = $(document.getElementById('writeNoteSummernote'));
  writeNoteSummernote.summernote({
    placeholder: 'write your note here',
    tabsize: 2,
    height: 100,
    minHeight: 100
  });
  var goHome = document.getElementById('goHome');
  var goReactHello = document.getElementById('goReactHello');
  var sendNote = document.getElementById('sendNote');
  goHome.addEventListener('click', function () {
    window.location.href = homeRoute;
  });
  goReactHello.addEventListener('click', function () {
    window.location.href = reactHelloRoute;
  });
  sendNote.addEventListener('click', function () {
    loader.show();
    axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(previewSendNoteRoute, {}).then(function (resp) {
      loader.hide();
    }).catch(function (err) {});
  });
});

/***/ }),

/***/ 2:
/*!***********************************************************!*\
  !*** multi ./resources/js/previewPage/preview.compile.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/coderhero/Documents/coderhero/Dev/git/laravel-mix-glob/test/laravel/resources/js/previewPage/preview.compile.js */"./resources/js/previewPage/preview.compile.js");


/***/ })

/******/ });