import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';
import LocalStorageImpl from './store/localStorage';
import SessionStorageImpl from './store/sessionStorage';
import cookieStorageImpl from './store/cookieStorage';
import InternalStore from './store/internalStore';

export default function StoreProvider() {

  //caching is on by default
  let _caching = true;
  let _window = window;
  let localStorageImpl = new LocalStorageImpl(_window);
  let sessionStorageImpl = new SessionStorageImpl(_window);

  // the default storage
  let _storage = localStorageImpl;

  // mock window for testing
  this._setWindow = (_) => {
    _window = _;
    localStorageImpl = new LocalStorageImpl(_window);
    sessionStorageImpl = new SessionStorageImpl(_window);
  };

  // Expose storage implementations so they can be provided when requesting a new store
  this.getLocalStorageImpl = () => localStorageImpl;
  this.getSessionStorageImpl = () => sessionStorageImpl;
  this.getCookieStorageImpl = () => cookieStorageImpl;

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
  this.setStore = function(storage) {
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
  this.setCaching = function(useCache) {
    _caching = !!useCache;
  };

  // this.$get allows for direct plug into angular 1
  this.$get = this.createStore = function() {
    const store = new InternalStore(null, _storage, null, _caching);

    /**
     * Returns a namespaced store
     *
     * @param {String} namespace The namespace
     * @param {StoreImpl} [storage] The name of the storage service
     * @param {String} [delimiter] The key delimiter
     * @param {boolean} [useCache] whether to use the internal caching
     * @returns {InternalStore}
     */
    store.getNamespacedStore = function(namespace, storage, delimiter, useCache) {
      const storageImpl = validateStorageImpl(storage) ? storage : _storage;
      return new InternalStore(namespace, storageImpl, delimiter, useCache);
    };

    return store;
  };

  function validateStorageImpl(storage) {
    return storage && isObject(storage) && isFunction(storage.get) && isFunction(storage.set) && isFunction(storage.remove);
  }
}
