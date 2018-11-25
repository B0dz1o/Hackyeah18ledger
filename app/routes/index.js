var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./balances');
var query = require('../query');
var invoke = require('../invoke');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addPoints/:points/for/:userName', (req, res, next) => {
  var pointsAdded = Number.parseInt(req.params.points, 10);

  var userName = req.params.userName;
  query.getAllCustomers().then( data => {
    let dataOb = JSON.parse(data)
    let user = dataOb.filter( (v,i,a) => {
      return v.Record.userName === userName
    })[0]
    var key = user.Key;
    console.log(typeof key);
    user.Record.transactions.push( {
      pointsAdded,
      date: new Date()
    });
    user.Record.balance += pointsAdded;
    invoke.saveCustomer(key, user).then ( data => {
      res.send({ user: user.Record });
    })
  })


});

router.get('/currentBalanceOf/:userName', (req, res, next) => {
  var userName = req.params.userName;
  query.getAllCustomers().then( data => {
    let dataOb = JSON.parse(data)
    let user = dataOb.filter( (v,i,a) => {
      return v.Record.userName === userName
    })[0].Record
    res.send({ user });
  })
  // var userName = req.params.userName;
  // var userData = JSON.parse(localStorage.getItem(userName));
  // if (userData === null) {
  //   userData = { userName, transactions: [], balance: 0}
  // }
  // var currentBalance = userData.balance;
  // res.send({ currentBalance, userName });
});

router.get('/transactionHistoryOf/:userName', (req, res, next) => {
  var userName = req.params.userName;
  query.getAllCustomers().then( data => {
    let dataOb = JSON.parse(data)
    let user = dataOb.filter( (v,i,a) => {
      return v.Record.userName === userName
    })[0].Record.transactions
    res.send({ user });
  })
});

module.exports = router;
