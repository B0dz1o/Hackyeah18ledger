var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
