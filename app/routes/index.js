var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./balances');
var query = require('../query')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addPoints/:points/for/:userName', (req, res, next) => {
  var userName = req.params.userName;
  var pointsAdded = Number.parseInt(req.params.points, 10);
  var marshalled = localStorage.getItem(userName);
  var userData = JSON.parse(marshalled);
  if (userData === null) {
    userData = { userName, transactions: [], balance: 0}
  }
  userData.transactions.push({
    pointsAdded,
    date: new Date()
  });
  var prevBalance = userData.balance
  var currentBalance = prevBalance + pointsAdded;
  userData.balance = currentBalance;
  console.log(JSON.stringify(userData));
  localStorage.setItem(userName, JSON.stringify(userData));
  res.send({ pointsAdded, currentBalance, userName });
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
