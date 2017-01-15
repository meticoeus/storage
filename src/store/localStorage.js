import cookieStorage from './cookieStorage';

/**
 * @constructor
 * @implements StoreImpl
 */
function LocalStorageService(_window) {
  let localStorageAvailable;

  try {
    _window.localStorage.setItem('testKey', 'test');
    _window.localStorage.removeItem('testKey');
    localStorageAvailable = true;
  } catch (e) {
    localStorageAvailable = false;
  }
  if (localStorageAvailable) {
    this.set = (what, value) => _window.localStorage.setItem(what, value);

    this.get = (what) => _window.localStorage.getItem(what);

    this.remove = (what) => _window.localStorage.removeItem(what);

    this.clear = () => {
      _window.localStorage.clear();
    };
  } else {
    this.set = cookieStorage.set;
    this.get = cookieStorage.get;
    this.remove = cookieStorage.remove;
  }
}

export default LocalStorageService;
