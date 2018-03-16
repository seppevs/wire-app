'use strict';

// a factory method:
function userRepository() {
  return {
    save(user) {
      console.log(`Saved ${user}`);
    },
  };
}

module.exports = userRepository;
