var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./balances');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addPoints/:points/for/:userName', (req, res, next) => {
  var userName = req.params.userName;
  var pointsAdded = Number.parseInt(req.params.points, 10);
  var prevBalanceStr = localStorage.getItem(userName);
  var prevBalance = Number.parseInt(prevBalanceStr, 10) || 0;
  var currentBalance = prevBalance + pointsAdded;
  localStorage.setItem(userName, currentBalance);
  res.send({ pointsAdded, currentBalance, userName });
});

router.get('/currentBalanceOf/:userName', (req, res, next) => {
  var userName = req.params.userName;
  var currentBalanceStr = localStorage.getItem(userName);
  var currentBalance = Number.parseInt(currentBalanceStr, 10) || 0;
  localStorage.setItem(userName, currentBalance);
  res.send({ currentBalance, userName });
});

points = 0;

router.get('/addPoints/:points', (req, res, next) => {
  var newPoints = Number.parseInt(req.params.points, 10);
  points += newPoints;
  res.send({pointsAdded: newPoints, currentState: points});
});

router.get('/addPointsVisual/:points', (req, res, next) => {
  var newPoints = Number.parseInt(req.params.points, 10);
  points += newPoints;
  var resultPoints = `Dodano punkty: ${ req.params.points }!\n
  Obecny stan: ${points}`;
  res.render('index', { title:  resultPoints});
});

router.get('/currentBalance', (req, res, next) => {
  var currentBalance = points;
  res.send({ currentBalance })
});

module.exports = router;
