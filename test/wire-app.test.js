'use strict';

const path = require('path');

const wireApp = require('../src/wire-app');

describe('wireApp', () => {

  function grandParent() {
    return {
      grandParentMethod() {
        return 'it works';
      }
    }
  }

  class parent {
    constructor(grandParent) {
      this.grandParent = grandParent;
    }

    parentMethod() {
      return this.grandParent.grandParentMethod();
    }
  }

  function child(parent) {
    return {
      childMethod() {
        return parent.parentMethod();
      }
    }
  }

  function componentWithUnknownDependency(unknownDependency) {
    return {
      someMethod() {
        return unknownDependency.something();
      }
    };
  }

  describe('register()', () => {
    it('should instantiate factories and classes with their dependencies injected', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .register(grandParent)
          .register(child)
          .register(parent)
          .on('ready', (app) => {
            expect(app.get('child').childMethod()).toEqual('it works');
            return resolve();
          });
      });
    });

    it('should emit an error when attempting to wire an unknown component', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .register(componentWithUnknownDependency)
          .on('error', (err) => {
            expect(err.message).toEqual('Cannot wire unknown component: "unknownDependency"');
            return resolve();
          });
      });
    });

    it('should emit an error when attempting to register a non function type', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .register('bla')
          .on('error', (err) => {
            expect(err.message).toEqual('Register supports only functions');
            return resolve();
          })
      });
    });
  });

  describe('set() and get()', () => {
    it('should store and retrieve a value in the application context on the given key', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .set('myKey', { foo: 'bar' })
          .set('amount', 42)
          .on('ready', (app) => {
            expect(app.get('myKey')).toEqual({ foo: 'bar' });
            expect(app.get('amount')).toEqual(42);
            return resolve();
          });
      });
    });

    it('should return undefined when trying to `get` an unknown key', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .on('ready', (app) => {
            expect(app.get('myKey')).toEqual(undefined);
            return resolve();
          });
      });
    });
  });

  describe('scan()', () => {
    function expectIsWiredCorrectly(app) {
      const orderService = app.get('orderService');
      return orderService.findAllCustomers()
        .then((data) => expect(data).toEqual([{ "name": "firstCustomer" }, { "name": "secondCustomer" }]))
        .then(() => orderService.findAllAccounts())
        .then((data) => expect(data).toEqual([{ "name": "firstAccount" }, { "name": "secondAccount" }]))
    }

    it('should recursively scan directories, instantiate factories & classes with their dependencies injected', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .scan('./__testApp__/service')
          .scan('./__testApp__/model')
          .scan('./__testApp__/repository')
          .on('ready', (app) => expectIsWiredCorrectly(app).then(resolve));
      });
    });

    it('should support absolute paths', () => {
      const absoluteServicePath = path.join(__dirname, '__testApp__/service');
      return new Promise((resolve) => {
        wireApp('testApp')
          .scan(absoluteServicePath)
          .scan('./__testApp__/model')
          .scan('./__testApp__/repository')
          .on('ready', (app) => expectIsWiredCorrectly(app).then(resolve));
      });
    });

    it('should ignore unresolvable paths', () => {
      return new Promise((resolve) => {
        wireApp('testApp')
          .scan('./__testApp__/notExisting')
          .on('ready', (app) => {
            expect(app.appContext).toEqual({});
            resolve();
          });
      });
    });
  });

  describe('on()', () => {
    it('should emit an event when the application is ready', () => {
      return new Promise((resolve) => {
        wireApp('testApp').on('ready', (app) => {
          expect(app.name).toEqual('testApp');
          resolve()
        });
      });
    });
  });

});