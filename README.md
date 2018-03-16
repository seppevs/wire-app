# wire-app
A tiny, but powerful dependency injection container for your Node.js apps

## Features
* manual registering of factory fuctions and classes
* scanning directories for factory functions and classes to instantiate
* setting values and getting values
* injecting dependencies (duh)

## Quick Example
```javascript
const wireApp = require('wire-app');

wireApp('myCoolApp')
  .scan('./some/relative/dir')
  .scan('/some/absolute/dir')
  .register(taskRunner)
  .set('config', { my: 'values'})
  .on('error', (err) => console.error(err.message))
  .on('ready', (app) => {
    console.log(`${app.name} started!`);
    console.log(app.get('config'));
    app.get('taskRunner').run();
  });
```

## API

The API is fluent. All functions, except `get()` can be chained.

### wire-app(name)
Constructs a new app and returns it.

#### Example
```javascript
wireApp('myApp')
  .on('ready', (app) => console.log(app.name)); // prints `myApp`
```

All other functions mentioned below are part of the 'app' API.

### app.register(fn)
The `register(fn)` function will 
1. Invoke the `fn` parameter and inject its dependencies
2. register it in the application context, under the function name.

The `fn` function should be a factory function OR a class, and must have a name.

The order you invoke the register functions does not matter. Wire-app will figure out dependency order.

The `register(fn)` function returns the `app` to provide a fluent API.

[See this example](https://github.com/seppevs/wire-app/tree/master/examples/register/index.js)

### app.scan(scanPath)
Scans recursively am absolute or relative directory for exposed factory methods and/or classes.
It will register them, similar to the `app.register(fn)` function

The `app.scan(scanPath)` function returns the app to provide a fluent API.

[See this example](https://github.com/seppevs/wire-app/tree/master/examples/scan)

### app.set(key, value)
Stores a value, under a certain key, in the application context

The value can be of any type. No dependency injection will occur

The `app.set(key, value)` function returns the app to provide a fluent API.

### app.get(key)
Returns the value (or component) registered under the requested key.

### app events
The `app` is an EventEmitter and will emit a few events

#### `'ready'`
This event is emitted when the whole application was wired successfully.

It emits the `app` as its first parameter

#### `'error'`
Will be emitted when something went wrong during the wiring phase.

## Thanks
The idea of the API comes from [Dieter Luypaert](https://github.com/moeriki).
