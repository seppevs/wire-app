'use strict';

function accountRepository(account) {

  return {
    findMany() {
      return Promise.resolve([account.create('firstAccount'), account.create('secondAccount')]);
    }
  }

}

module.exports = accountRepository;
