'use strict'

const wireApp = require('../../src/wire-app');

wireApp('myApp')
  .scan('./controller')
  .scan('./service')
  .scan('./repository')
  .on('ready', (app) => {
    app.get('userController').register('John'); // prints 'Saved John'
  });
