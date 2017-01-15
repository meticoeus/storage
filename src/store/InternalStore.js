import isUndefined from 'lodash.isundefined';

export default class InternalStore {
  constructor(namespace, storage, delimiter = '.', useCache = true) {
    this.namespace = namespace || null;
    if (isUndefined(useCache) || useCache == null) {
      useCache = true;
    }
    this.useCache = useCache;
    this.delimiter = delimiter;
    this.inMemoryCache = {};
    this.storage = storage;
  }

  getNamespacedKey(key) {
    if (!this.namespace) {
      return key;
    } else {
      return [this.namespace, key].join(this.delimiter);
    }
  }

  set(name, elem) {
    if (this.useCache) {
      this.inMemoryCache[name] = elem;
    }
    this.storage.set(this.getNamespacedKey(name), JSON.stringify(elem));
  }

  get(name) {
    let obj = null;
    if (this.useCache && name in this.inMemoryCache) {
      return this.inMemoryCache[name];
    }
    const saved = this.storage.get(this.getNamespacedKey(name));
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
  };

  remove(name) {
    if (this.useCache) {
      this.inMemoryCache[name] = null;
    }
    this.storage.remove(this.getNamespacedKey(name));
  }
}
