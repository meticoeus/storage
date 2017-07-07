'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isundefined');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InternalStore = function () {
  function InternalStore(namespace, storage) {
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    var useCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, InternalStore);

    this.namespace = namespace || null;
    if ((0, _lodash2.default)(useCache) || useCache == null) {
      useCache = true;
    }
    this.useCache = useCache;
    this.delimiter = delimiter;
    this.inMemoryCache = {};
    this.storage = storage;
  }

  _createClass(InternalStore, [{
    key: 'getNamespacedKey',
    value: function getNamespacedKey(key) {
      if (!this.namespace) {
        return key;
      } else {
        return [this.namespace, key].join(this.delimiter);
      }
    }
  }, {
    key: 'set',
    value: function set(name, elem) {
      if (this.useCache) {
        this.inMemoryCache[name] = elem;
      }
      this.storage.set(this.getNamespacedKey(name), JSON.stringify(elem));
    }
  }, {
    key: 'get',
    value: function get(name) {
      var obj = null;
      if (this.useCache && name in this.inMemoryCache) {
        return this.inMemoryCache[name];
      }
      var saved = this.storage.get(this.getNamespacedKey(name));
      try {

        if (typeof saved === 'undefined' || saved === 'undefined') {
          obj = undefined;
        } else {
          obj = JSON.parse(saved);
        }

        if (this.useCache) {
          this.inMemoryCache[name] = obj;
        }
      } catch (e) {
        console.error('Error parsing saved value', e);
        this.remove(name);
      }
      return obj;
    }
  }, {
    key: 'remove',
    value: function remove(name) {
      if (this.useCache) {
        this.inMemoryCache[name] = null;
      }
      this.storage.remove(this.getNamespacedKey(name));
    }
  }]);

  return InternalStore;
}();

exports.default = InternalStore;