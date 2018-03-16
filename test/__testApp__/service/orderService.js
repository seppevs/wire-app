'use strict';

function orderService(customerRepository, accountRepository) {

  return {
    findAllCustomers() {
      return customerRepository.findMany();
    },
    findAllAccounts() {
      return accountRepository.findMany();
    }
  }

}

module.exports = orderService;
