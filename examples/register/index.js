'use strict';

const wireApp = require('../../src/wire-app');

// a factory method:
function userRepository() {
  return {
    save(user) {
      console.log(`Saved ${user}`);
    },
  };
}

// another factory method
// wire-app will inject the userRepository
function userService(userRepository) {
  return {
    create(user) {
      userRepository.save(user);
    },
  };
}

// a class, wire-app will inject the userService
class userController {
  constructor(userService) {
    this.userService = userService;
  }
  register(user) {
    this.userService.create(user);
  }
}

wireApp('myApp')
  .register(userController)
  .register(userRepository)
  .register(userService)
  .on('ready', (app) => {
    app.get('userController').register('John'); // prints 'Saved John'
  });