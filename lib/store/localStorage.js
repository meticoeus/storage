'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookieStorage = require('./cookieStorage');

var _cookieStorage2 = _interopRequireDefault(_cookieStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @constructor
 * @implements StoreImpl
 */
function LocalStorageService(_window) {
  var localStorageAvailable = void 0;

  try {
    _window.localStorage.setItem('testKey', 'test');
    _window.localStorage.removeItem('testKey');
    localStorageAvailable = true;
  } catch (e) {
    localStorageAvailable = false;
  }
  if (localStorageAvailable) {
    this.set = function (what, value) {
      return _window.localStorage.setItem(what, value);
    };

    this.get = function (what) {
      return _window.localStorage.getItem(what);
    };

    this.remove = function (what) {
      return _window.localStorage.removeItem(what);
    };

    this.clear = function () {
      _window.localStorage.clear();
    };
  } else {
    this.set = _cookieStorage2.default.set;
    this.get = _cookieStorage2.default.get;
    this.remove = _cookieStorage2.default.remove;
  }
}

exports.default = LocalStorageService;