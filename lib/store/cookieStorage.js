'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @implements StoreImpl
 */
exports.default = {
  set: function set(what, value) {
    return _jsCookie2.default.set(what, value);
  },
  get: function get(what) {
    return _jsCookie2.default.get(what);
  },
  remove: function remove(what) {
    return _jsCookie2.default.remove(what);
  }
};