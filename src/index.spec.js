/* global after */
/* global afterEach */
/* global beforeEach */
/* global describe */
/* global it */
/* global global */

'use strict';
const LocalStorage = require('node-localstorage').LocalStorage;
import fs from 'fs';
import jsdom from 'jsdom';
import {expect} from 'chai';
global.document = jsdom.jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
if (!fs.existsSync('./scratch')) {
  fs.mkdirSync('./scratch');
}
global.window.localStorage = global.window.sessionStorage = new LocalStorage('./scratch');
import Cookies from 'js-cookie';
import StoreProvider from './index';

describe('storage', function () {

  afterEach(function() {
    global.window.localStorage.clear();
  });

  after(function () {
    fs.rmdirSync('./scratch');
  });

  describe('store', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      store = provider.createStore();
    });

    it('should save items correctly in localStorage', function () {
      const value = 1;
      store.set('gonto', value);
      expect(store.get('gonto')).to.equal(value);
    });

    it('should save null items correctly in localStorage', function () {
      store.set('gonto', null);
      store.inMemoryCache = {};
      expect(store.get('gonto')).to.equal(null);
    });

    it('should save undefined items correctly in localStorage', function () {
      store.set('gonto', undefined);
      store.inMemoryCache = {};
      expect(store.get('gonto')).to.equal(undefined);
    });

    it('should delete items correctly from localStorage', function () {
      const value = 1;
      store.set('gonto', value);
      expect(store.get('gonto')).to.equal(value);
      store.remove('gonto');
      expect(store.get('gonto')).to.not.exist;
    });

    it('should save objects correctly', function () {
      const value = {
        gonto: 'hola'
      };
      store.set('gonto', value);
      expect(store.get('gonto')).to.eql(value);
    });

    it('should save objects correctly', function () {
      const value = {
        gonto: 'hola'
      };
      store.set('gonto', value);
      expect(store.get('gonto')).to.eql(value);
    });

    it('should save and objects correctly without cache', function () {
      const value = {
        gonto: 'hola'
      };
      store.set('gonto', value);
      store.inMemoryCache = {};
      expect(store.get('gonto')).to.eql(value);
      expect(store.get('gonto')).not.to.equal(value);
    });

    it('should save and objects correctly without cache', function () {
      const value = {
        gonto: 'hola'
      };
      store.set('gonto', value);
      store.inMemoryCache = {};
      expect(store.get('gonto')).to.eql(value);
      expect(store.get('gonto')).not.to.equal(value);
    });
  });

  describe('storeProvider.setCaching(false)', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      provider.setCaching(false);
      store = provider.createStore();
    });

    it('should not store into internal cache', function () {
      const value1 = 'some value';
      const value2 = 256;
      store.set('key1', value1);
      store.set('key2', value2);
      store.remove('key1');

      expect(store.inMemoryCache).to.be.empty;
      expect(store.get('key2')).to.equal(value2);
    });

    it('should store into internal cache in namespaced store when default caching', function () {
      const namespacedStore = store.getNamespacedStore('bb');
      const value1 = 'some value';
      const value2 = 256;

      namespacedStore.set('key1', value1);
      namespacedStore.set('key2', value2);

      expect(namespacedStore.inMemoryCache).not.to.be.empty;
      expect(namespacedStore.inMemoryCache).to.have.property('key1');
      expect(namespacedStore.inMemoryCache).to.have.property('key2');
    });

    it('should not store into internal cache in namespaced store when caching=false', function () {
      const namespacedStore = store.getNamespacedStore('bb', provider.getLocalStorageImpl(), null, false);
      const value1 = 'some value';
      const value2 = 256;

      namespacedStore.set('key1', value1);
      namespacedStore.set('key2', value2);

      expect(namespacedStore.inMemoryCache).to.be.empty;
      expect(namespacedStore.get('key1')).to.equal(value1);
      expect(namespacedStore.get('key2')).to.equal(value2);
    });
  });

  describe('storeProvider.setStore(sessionStorage)', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      provider.setStore(provider.getSessionStorageImpl());
      store = provider.createStore();
    });

    it('should save items correctly in the sessionStorage', function () {
      const value = 99;
      store.set('gonto123', value);
      store.inMemoryCache = {};

      expect(store.get('gonto123')).to.equal(value);
      expect(window.sessionStorage.getItem('gonto123')).to.exist;
      expect(window.sessionStorage.getItem('gonto123')).to.equal(value.toString());

      store.remove('gonto123');

      expect(store.get('gonto123')).to.not.exist;
      expect(window.sessionStorage.getItem('gonto123')).to.not.exist;
    });
  });

  describe('storeProvider.setStore(sessionStorage), missing sessionStorage', function () {
    let provider;
    let store;
    let windowMock;

    beforeEach(function() {
      windowMock = { sessionStorage: undefined };
      provider = new StoreProvider();
      provider._setWindow(windowMock);
      provider.setStore(provider.getSessionStorageImpl());
      store = provider.createStore();
    });

    it('should fallback to cookieStorage', function() {
      const value = 99;
      store.set('gonto123', value);

      expect(store.get('gonto123')).to.equal(value);
      expect(Cookies.get('gonto123')).to.equal(JSON.stringify(value));
    });
  });

  describe('storeProvider.setStore(localStorage)', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      provider.setStore(provider.getLocalStorageImpl());
      store = provider.createStore();
    });

    it('should save items correctly in the localStorage', function () {
      const value = 55;
      store.set('gonto', value);

      expect(store.get('gonto')).to.equal(value);
      expect(window.localStorage.getItem('gonto')).to.exist;
      expect(window.localStorage.getItem('gonto')).to.equal(value.toString());
    });
  });

  describe('storeProvider.setStore(cookieStorage)', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      provider.setStore(provider.getCookieStorageImpl());
      store = provider.createStore();
    });

    it('should save items correctly in the cookieStorage', function () {
      const value = 66;
      store.set('gonto', value);

      expect(store.get('gonto')).to.equal(value);
      expect(Cookies.get('gonto')).to.equal(JSON.stringify(value));
    });
  });

  describe('storeProvider.setStore()', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
    });

    it('should throw an error if not provided a valid store', function () {
      expect(() => provider.setStore()).to.throw();
    });
  });

  describe('storeProvider.setStore(123)', function () {
    let provider;
    let store;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
    });

    it('should throw an error if not provided a valid store', function () {
      expect(() => provider.setStore(123)).to.throw();
    });
  });

describe('storeProvider.setStore("abc")', function () {
  let provider;
  let store;

  beforeEach(function () {
    provider = new StoreProvider();
    provider._setWindow(global.window);
  });

  it('should throw an error if not provided a valid store', function () {
    expect(() => provider.setStore('abc')).to.throw();
  });
});

// TODO: mock window and cookie store
// describe('store: cookie fallback', function() {
//
//   /* these tests ensure that the cookie fallback works correctly.
//    *
//    * note - to confirm that cookiestore was used we attempt to retrieve the value from the cookie
//    since this bypasses our service, the result will not have been json parsed
//    therefore we use JSON.stringify on the expected value, so comparing like for like
//    *
//    */
//
//   let windowMock, $cookies;
//   const mockCookieStore = {};
//
//   /* provide a mock for window where localStorage is not defined */
//   beforeEach(module('ngCookies', 'angular-storage.store', function ($provide) {
//
//     // decorator to mock the methods of the cookieStore
//     $provide.decorator('$cookies', function ($delegate) {
//       $delegate.put = function (key, value) {
//         mockCookieStore[key] = value;
//       };
//       $delegate.get = function (key) {
//         return mockCookieStore[key];
//       };
//       $delegate.remove = function (key) {
//         delete mockCookieStore[key];
//       };
//       return $delegate;
//     });
//
//     windowMock = { localStorage: undefined };
//     $provide.value('window', windowMock);
//   });
//
//   beforeEach(function (_$cookies_) {
//     $cookies = _$cookies_;
//   });
//
//   it('should save items correctly in localStorage', function() {
//     const value = 1;
//     store.set('gonto', value);
//     expect(store.get('gonto')).to.equal(value); //this line asserts that value was saved by our service
//     expect($cookies.get('gonto')).to.equal(JSON.stringify(value)); //this line asserts that cookie store was used
//   });
//
//   it('should save null items correctly in localStorage', function() {
//     store.set('gonto', null);
//     store.inMemoryCache = {};
//     expect(store.get('gonto')).to.equal(null);
//     expect($cookies.get('gonto')).to.equal(JSON.stringify(null));
//   });
//
//   it('should save undefined items correctly in localStorage', function() {
//     store.set('gonto', undefined);
//     store.inMemoryCache = {};
//     expect(store.get('gonto')).to.equal(undefined);
//     expect($cookies.get('gonto')).to.equal(JSON.stringify(undefined));
//   });
//
//   it('should delete items correctly from localStorage', function() {
//     const value = 1;
//     store.set('gonto', value);
//     expect(store.get('gonto')).to.equal(value);
//     store.remove('gonto');
//     expect(store.get('gonto')).to.not.exist;
//     expect($cookies.get('gonto')).to.not.exist;
//   });
//
//   it('should save objects correctly', function() {
//     const value = {
//       gonto: 'hola'
//     };
//     store.set('gonto', value);
//     expect(store.get('gonto')).to.eql(value);
//   });
//
//   it('should save objects correctly', function() {
//     const value = {
//       gonto: 'hola'
//     };
//     store.set('gonto', value);
//     expect(store.get('gonto')).to.eql(value);
//     expect($cookies.get('gonto')).to.equal(JSON.stringify(value));
//   });
//
//   it('should save objects correctly without cache', function() {
//     const value = {
//       gonto: 'hola'
//     };
//     store.set('gonto', value);
//     store.inMemoryCache = {};
//     expect(store.get('gonto')).to.eql(value);
//     expect(store.get('gonto')).not.to.equal(value);
//   });
//
//   it('should save objects correctly without cache', function() {
//     const value = {
//       gonto: 'hola'
//     };
//     store.set('gonto', value);
//     store.inMemoryCache = {};
//     expect(store.get('gonto')).to.eql(value);
//     expect(store.get('gonto')).not.to.equal(value);
//     expect($cookies.get('gonto')).to.eql(JSON.stringify(value));
//
//   });
//
// });

  describe('new namespaced store', function () {
    let provider;
    let store;
    let newStore = null;

    beforeEach(function () {
      provider = new StoreProvider();
      provider._setWindow(global.window);
      store = provider.createStore();
      newStore = store.getNamespacedStore('auth0');
    });

    it('should save items correctly', function () {
      const value = 1;
      newStore.set('myCoolValue', value);
      expect(newStore.get('myCoolValue')).to.equal(value);
      expect(window.localStorage.getItem('auth0.myCoolValue')).to.exist;
      expect(window.localStorage.getItem('myCoolValue')).to.not.exist;
    });

    it('should delete items correctly from localStorage', function () {
      const value = 1;
      newStore.set('gonto', value);
      expect(newStore.get('gonto')).to.equal(value);
      newStore.remove('gonto');
      expect(newStore.get('gonto')).to.not.exist;
    });

    it('should save objects correctly', function () {
      const value = {
        gonto: 'hola'
      };
      newStore.set('gonto', value);
      expect(newStore.get('gonto')).to.eql(value);
    });

    it('should save objects correctly', function () {
      const value = {
        gonto: 'hola'
      };
      newStore.set('gonto', value);
      expect(newStore.get('gonto')).to.eql(value);
    });

    it('should save and objects correctly without cache', function () {
      const value = {
        gonto: 'hola'
      };
      newStore.set('gonto', value);
      newStore.inMemoryCache = {};
      expect(newStore.get('gonto')).to.eql(value);
      expect(newStore.get('gonto')).not.to.equal(value);
    });

    it('should save and objects correctly without cache', function () {
      const value = {
        gonto: 'hola'
      };
      newStore.set('gonto', value);
      newStore.inMemoryCache = {};
      expect(newStore.get('gonto')).to.eql(value);
      expect(newStore.get('gonto')).not.to.equal(value);
    });

    it('should should save items correctly when the delimiter is set', function () {
      const value = 111;
      const aStore = store.getNamespacedStore('aa', provider.getSessionStorageImpl(), '-', true);
      aStore.set('wayne', value);

      expect(aStore.get('wayne')).to.equal(value);
      expect(window.sessionStorage.getItem('aa-wayne')).to.exist;
      expect(window.sessionStorage.getItem('aa-wayne')).to.equal(value.toString());
      expect(window.sessionStorage.getItem('wayne')).to.not.exist;
    });

    describe('with param storage', function () {

      it('should should save items correctly when the storage is set to sessionStorage', function () {
        const value = 111;
        const sessionStore = store.getNamespacedStore('aa', provider.getSessionStorageImpl());
        sessionStore.set('wayne', value);

        expect(sessionStore.get('wayne')).to.equal(value);
        expect(window.sessionStorage.getItem('aa.wayne')).to.exist;
        expect(window.sessionStorage.getItem('aa.wayne')).to.equal(value.toString());
        expect(window.sessionStorage.getItem('wayne')).to.not.exist;
      });

      it('should should save items correctly when the storage is set to localStorage', function () {
        const value = 222;
        const localStore = store.getNamespacedStore('bb', provider.getLocalStorageImpl());
        localStore.set('wayne', value);

        expect(localStore.get('wayne')).to.equal(value);
        expect(window.localStorage.getItem('bb.wayne')).to.exist;
        expect(window.localStorage.getItem('bb.wayne')).to.equal(value.toString());
        expect(window.localStorage.getItem('wayne')).to.not.exist;
      });

      it('should should save items correctly when the storage is set to cookieStorage', function () {
        const value = 222;
        const cookieStore = store.getNamespacedStore('cc', provider.getCookieStorageImpl());
        cookieStore.set('wayne', value);

        expect(cookieStore.get('wayne')).to.equal(value);
        expect(Cookies.get('cc.wayne')).to.equal(JSON.stringify(value));
      });
    });
  });
});