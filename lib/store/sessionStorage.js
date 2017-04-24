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
function SessionStorageService(_window) {
  var sessionStorageAvailable = void 0;

  try {
    _window.sessionStorage.setItem('testKey', 'test');
    _window.sessionStorage.removeItem('testKey');
    sessionStorageAvailable = true;
  } catch (e) {
    sessionStorageAvailable = false;
  }

  if (sessionStorageAvailable) {
    this.set = function (what, value) {
      return _window.sessionStorage.setItem(what, value);
    };

    this.get = function (what) {
      return _window.sessionStorage.getItem(what);
    };

    this.remove = function (what) {
      return _window.sessionStorage.removeItem(what);
    };
  } else {
    this.set = _cookieStorage2.default.set;
    this.get = _cookieStorage2.default.get;
    this.remove = _cookieStorage2.default.remove;
  }
}

exports.default = SessionStorageService;