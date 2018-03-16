'use strict';

function account() {

  return {
    create(name) {
      return { name };
    }
  };

}

module.exports = account;
