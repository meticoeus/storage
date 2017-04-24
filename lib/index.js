'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StoreProvider;

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _localStorage = require('./store/localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _sessionStorage = require('./store/sessionStorage');

var _sessionStorage2 = _interopRequireDefault(_sessionStorage);

var _cookieStorage = require('./store/cookieStorage');

var _cookieStorage2 = _interopRequireDefault(_cookieStorage);

var _internalStore = require('./store/internalStore');

var _internalStore2 = _interopRequireDefault(_internalStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StoreProvider() {

  //caching is on by default
  var _caching = true;
  var _window = window;
  var localStorageImpl = new _localStorage2.default(_window);
  var sessionStorageImpl = new _sessionStorage2.default(_window);

  // the default storage
  var _storage = localStorageImpl;

  // mock window for testing
  this._setWindow = function (_) {
    _window = _;
    localStorageImpl = new _localStorage2.default(_window);
    sessionStorageImpl = new _sessionStorage2.default(_window);
  };

  // Expose storage implementations so they can be provided when requesting a new store
  this.getLocalStorageImpl = function () {
    return localStorageImpl;
  };
  this.getSessionStorageImpl = function () {
    return sessionStorageImpl;
  };
  this.getCookieStorageImpl = function () {
    return _cookieStorage2.default;
  };

  /**
   * Store backing implementation.
   *
   * @interface StoreImpl
   */

  /**
   * Set a value in the store.
   * @function
   * @name StoreImpl#set
   * @param {String} name
   * @param {*} value
   */

  /**
   * Get a value from the store.
   * @function
   * @name StoreImpl#get
   * @param {String} name
   * @return {*} value
   */

  /**
   * Remove a value from the store.
   * @function
   * @name StoreImpl#remove
   * @param {String} name
   */

  /**
   * Sets the storage implementation.
   *
   * @param {StoreImpl} storage The storage implementation
   */
  this.setStore = function (storage) {
    if (validateStorageImpl(storage)) {
      _storage = storage;
    } else {
      throw new Error('Expected a valid storage implementation.');
    }
  };

  /**
   * Sets the internal cache usage
   *
   * @param {boolean} useCache Whether to use internal cache
   */
  this.setCaching = function (useCache) {
    _caching = !!useCache;
  };

  // this.$get allows for direct plug into angular 1
  this.$get = this.createStore = function () {
    var store = new _internalStore2.default(null, _storage, null, _caching);

    /**
     * Returns a namespaced store
     *
     * @param {String} namespace The namespace
     * @param {StoreImpl} [storage] The name of the storage service
     * @param {String} [delimiter] The key delimiter
     * @param {boolean} [useCache] whether to use the internal caching
     * @returns {InternalStore}
     */
    store.getNamespacedStore = function (namespace, storage, delimiter, useCache) {
      var storageImpl = validateStorageImpl(storage) ? storage : _storage;
      return new _internalStore2.default(namespace, storageImpl, delimiter, useCache);
    };

    return store;
  };

  function validateStorageImpl(storage) {
    return storage && (0, _lodash4.default)(storage) && (0, _lodash2.default)(storage.get) && (0, _lodash2.default)(storage.set) && (0, _lodash2.default)(storage.remove);
  }
}