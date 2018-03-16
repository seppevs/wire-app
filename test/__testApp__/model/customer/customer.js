'use strict';

function customer() {

  return {
    create(name) {
      return { name };
    }
  };

}

module.exports = customer;
