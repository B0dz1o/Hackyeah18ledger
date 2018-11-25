/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'Orlen' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated Orlen chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'Orlen'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  // async queryCustomer(stub, args) {
  //   if (args.length != 1) {
  //     throw new Error('Incorrect number of arguments. Expecting user name ex: "Jan Kowalski"');
  //   }

  //   let userName = args[0];
  //   let method = this.queryAllCustomers;

  //   let users = await method(stub, args); //get the user from chaincode state
  //   let selectedUser = users.filter( (v,i,a) => {
  //     return v.Record.userName === userName;
  //   })[0];

  //   return Buffer.from(JSON.stringify(selectedUser));
  //   // if (!carAsBytes || carAsBytes.toString().length <= 0) {
  //   //   throw new Error(carNumber + ' does not exist: ');
  //   // }
  // }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let customers = [];
    customers.push({
      "userName": "darek",
      "transactions": [
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:38:01.121Z"
        },
        {
          "pointsAdded": 10,
          "date": "2018-11-24T21:39:32.625Z"
        },
        {
          "pointsAdded": 1,
          "date": "2018-11-24T21:59:29.767Z"
        }
      ],
      "balance": 16
    });
    customers.push({
      "userName": "piotrek",
      "transactions": [
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:42:42.714Z"
        },
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:42:46.605Z"
        },
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:42:47.581Z"
        }
      ],
      "balance": 15
    });
    customers.push({
      "userName": "marcin",
      "transactions": [
        {
          "pointsAdded": 100,
          "date": "2018-11-24T21:42:42.714Z"
        },
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:42:46.605Z"
        },
        {
          "pointsAdded": 5,
          "date": "2018-11-24T21:42:47.581Z"
        }
      ],
      "balance": 15
    });

    for (let i = 0; i < customers.length; i++) {
      customers[i].docType = 'customer';
      await stub.putState('CUSTOMER' + i, Buffer.from(JSON.stringify(customers[i])));
      console.info('Added <--> ', customers[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  // async createUser(stub, args) {
  //   console.info('============= START : Create Car ===========');
  //   if (args.length != 2) {
  //     throw new Error('Incorrect number of arguments. Expecting 5');
  //   }
  //   var userName = args[1];

  //   var customer =
  //   {
  //     docType: 'customer',
  //     userName,
  //     transactions: [],
  //     balance: 0
  //   }

  //   await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
  //   console.info('============= END : Create Car ===========');
  // }

  async queryAllCustomers(stub, args) {

    let startKey = 'CUSTOMER0';
    let endKey = 'CUSTOMER999';

    let iterator = await stub.getStateByRange(startKey, endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async setUser(stub, args) {
    console.info('============= START : changeCarOwner ===========');
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }
    var userName = args[1];
    var balance = args[2];
    var transactionsStr = args[3];
    var transactions = JSON.parse(transactionsStr);
    var user = { userName, balance, transactions };
    user.docType = 'customer';

    await stub.putState(args[0], Buffer.from(JSON.stringify(user)));
    console.info('============= END : changeCarOwner ===========');
  }
};

shim.start(new Chaincode());
