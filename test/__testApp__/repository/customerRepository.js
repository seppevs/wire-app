'use strict';

function customerRepository(customer) {

  return {
    findMany() {
      return Promise.resolve([customer.create('firstCustomer'), customer.create('secondCustomer')]);
    }
  }

}

module.exports = customerRepository;
