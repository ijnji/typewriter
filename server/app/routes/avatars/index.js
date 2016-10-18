'use strict'

const express = require('express');
const router = express.Router();
const db = require('../../../db');
const Match = db.model('match');
const User = db.model('user');


// router.get('.')   
