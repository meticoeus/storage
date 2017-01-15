import Cookies from 'js-cookie';

/**
 * @implements StoreImpl
 */
export default {
  set: (what, value) => Cookies.set(what, value),
  get: (what) => Cookies.get(what),
  remove: (what) => Cookies.remove(what),
}
