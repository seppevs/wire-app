'use strict'

// a factory function

// wire-app will inject the userRepository
function userService(userRepository) {
  return {
    create(user) {
      userRepository.save(user);
    },
  };
}

module.exports = userService;
