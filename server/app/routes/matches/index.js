'use strict'

const express = require('express');
const router = express.Router();
const db = require('../../../db');
const Match = db.model('match');
const User = db.model('user');


//get all matches

router.get('/', function (req, res, next){
  Match.findAll()
  .then(allMatches => res.send(allMatches))
  .catch(next);
})

//get specific match
router.get('/:matchId', function (req, res, next) {
  Match.findOne({
    where: {id: req.params.matchId}
  })
  .then(foundMatch => res.send(foundMatch))
  .catch(next);
});

router.get('/user/:userid', function(req, res, next){
    User.findOne({
        where: {id: req.params.userId}
    })
    .then(foundUser => foundUser.getMatches())
    .then(matches => res.send(matches));
});

//create new match
router.post('/', function (req, res, next) {
  Match.create(req.body)
    .then(foundMatch => res.status(201).send(foundMatch))
    .catch(next);
});


//edit match
router.put('/:matchId', function (req, res, next) {
     Match.findById(req.params.matchId)
    .then(foundMatch => foundMatch.update(req.body))
    .then(updatedMatch => res.send(updatedMatch))
    .catch(next);
});

module.exports = router;
