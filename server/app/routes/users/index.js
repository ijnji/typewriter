'use strict'

const express = require('express');
const router = express.Router();
const db = require('../../../db');
const User = db.model('user');

//get all users

router.get('/', function (req, res, next){
  console.log(req.session);
  User.findAll()
  .then(allUsers => res.send(allUsers))
  .catch(next);
})

//get specific user
router.get('/:userId', function (req, res, next) {
  User.findOne({
    where: {id: req.params.userId}
  })
  .then(foundUser => res.send(foundUser))
  .catch(next);
});

//get all matches for a specific user
router.get('/:userid/matches', function(req, res, next){
    User.findOne({
        where: {id: req.params.userId}
    })
    .then(foundUser => foundUser.getMatches())
    .then(matches => res.send(matches));
});


//sign up: create new user
router.post('/', function (req, res, next) {
  User.create(req.body)
    .then(foundUser => res.status(201).send(foundUser))
    .catch(next);
});


//edit user
router.put('/', function (req, res, next) {
  if (!req.params.userId) {
    req.session.address = req.body;
    res.send(req.body);
   } else {
     User.findById(req.session.passport.user)
    .then(foundUser => foundUser.update(req.body))
    .then(updatedUser => res.send(updatedUser))
    .catch(next);
   }
})

module.exports = router;
