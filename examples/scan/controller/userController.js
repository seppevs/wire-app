'use strict';

// a class, wire-app will inject the userService
class userController {
  constructor(userService) {
    this.userService = userService;
  }
  register(user) {
    this.userService.create(user);
  }
}

module.exports = userController;
