import cookieStorage from './cookieStorage';

/**
 * @constructor
 * @implements StoreImpl
 */
function SessionStorageService(_window) {
  let sessionStorageAvailable;

  try {
    _window.sessionStorage.setItem('testKey', 'test');
    _window.sessionStorage.removeItem('testKey');
    sessionStorageAvailable = true;
  } catch (e) {
    sessionStorageAvailable = false;
  }

  if (sessionStorageAvailable) {
    this.set = (what, value) => _window.sessionStorage.setItem(what, value);

    this.get = (what) => _window.sessionStorage.getItem(what);

    this.remove = (what) => _window.sessionStorage.removeItem(what);

  } else {
    this.set = cookieStorage.set;
    this.get = cookieStorage.get;
    this.remove = cookieStorage.remove;
  }
}

export default SessionStorageService;
