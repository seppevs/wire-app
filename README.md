# wire-app
A tiny, but powerful dependency injection container for your Node.js apps

## Features
* manual registering of factory fuctions and classes
* scanning directories for factory functions and classes to instantiate
* setting values and getting values
* injecting dependencies (duh)

## Example
```javascript
const wireApp = require('wire-app');

wireApp('myCoolApp')
  .scan('./repository') // a relative dir to scan
  .scan('/some/absolute/dir/service') // and absolute dir to scan
  .register(customerService) // manual registering of a factory function
  .set('config', { my: 'values'}) // setting values
  .on('error', (err) => console.error(err.message)) // listening to errors
  .on('ready', (app) => { // app is wired successful and ready to use
    console.log(`${app.name} started!`);
    console.log(app.get('config')) // retrieving values
    app.get(customerService).run(); // retrieving a (wired) component
  });
```

## API

The API is fluent. All functions, except `get()` can be chained.

### wire-app(name)
The `wire-app` module exposes a function. 
It can be invoked with the name of the application you're wiring. It returns the 'app'.

All other functions mentioned below are part of the 'app' API.

### app.register(fn)
This function will 
1. execute the `fn` parameter with its requested dependencies
2. register it in the application context, under the function name.

The function can be a factory function or a class.

It MUST be a named function!

This function returns the app (fluent api).

### app.scan(scanPath)
Scans a absolute or relative directory for exposed factory methods and/or classes.

This function returns the app (fluent api).

### app.set(key, value)
Store a value under a certain key, in the application context

The value can be of any type. No dependency injection will occur

This function returns the app (fluent api).

### app.get(key)
Returns the value (or component) registered under the requested key.

### app events
The application will emit several events

#### `'ready'`
This event is emitted when the whole application was wired successfully.

It emits the `app` as its first parameter

#### `'error'`
Will be emitted when something went wrong during the wiring phase.

## Thanks
The idea of the API comes from Dieter Luypaert