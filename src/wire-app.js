'use strict';

const EventEmitter = require('events');
const path = require('path');

const globby = require('globby');
const caller = require('caller');
const fnArgs = require('fn-args');
const camelCase = require('camelcase');

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

function instantiate(key, app) {
  const componentDef = app.appContext[key];

  const dependencies = componentDef.dependencies;
  const dependencyInstances = dependencies.map((dep) => app.appContext[dep].value);
  if (componentDef.instantiatorType === 'constructor') {
    componentDef.value = Reflect.construct(componentDef.instantiator, dependencyInstances);
  } else if (componentDef.instantiatorType === 'factoryMethod') {
    componentDef.value = componentDef.factory.apply(componentDef.instantiator, dependencyInstances);
  } else {
    throw new Error(`Cannot instantiate "${key}"`);
  }
}

function ensureComponentInstance(componentKey, app) {
  const componentDef = app.appContext[componentKey];
  if (!componentDef) {
    throw new Error(`Cannot wire unknown component: "${componentKey}"`)
  }
  if (!componentDef.value) {
    for (const dependency of componentDef.dependencies) {
      ensureComponentInstance(dependency, app)
    }
    instantiate(componentKey, app);
  }
}

function instantiateComponents(app) {
  const componentNames = Object.keys(app.appContext);
  for (const componentName of componentNames) {
    ensureComponentInstance(componentName, app);
  }
}

class App extends EventEmitter {
  constructor({dir, name}) {
    super();
    this.dir = dir;
    this.name = name;
    this.appContext = {};
    setImmediate(() => {
      try {
        instantiateComponents(this);
        this.emit('ready', this);
      } catch (err) {
        this.emit('error', err);
      }
    });
  }

  register(instantiator) {
    process.nextTick(() => {
      if (typeof instantiator !== 'function') {
        return this.emit('error', new Error('Register supports only functions'));
      }
      const componentName = camelCase(instantiator.name);
      const dependencies = fnArgs(instantiator);
      const instantiatorType = isConstructor(instantiator) ? 'constructor' : 'factoryMethod';
      this.appContext[componentName] = { dependencies, instantiatorType, instantiator };
    });
    return this;
  }

  scan(scanPath) {
    process.nextTick(() => {
      const absolutePath = path.isAbsolute(scanPath) ? scanPath : path.join(this.dir, scanPath);
      const files = globby.sync(absolutePath);
      for (const file of files) {
        const instantiator = require(file);
        this.register(instantiator);
      }
    });
    return this;
  }

  set(key, value) {
    this.appContext[key] = { value };
    return this;
  }

  get(key) {
    const componentDef = this.appContext[key];
    return componentDef ? componentDef.value : undefined;
  }
}

function wireApp(name) {
  const dir = path.dirname(caller());
  return new App({ dir, name });
}

module.exports = wireApp;
