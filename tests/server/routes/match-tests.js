// const expect = require('chai').expect;

// const Sequelize = require('sequelize');

// const db = require('../../../server/db');
// 	const Match = db.model('match')
// const supertest = require('supertest');
// const app = require('../../../server/app')(db)
// const agent = supertest.agent(app)

// describe('Match routes', function() {
// 	let theUser;
// 	before(function () {
// 	    return db.sync({force: true});
// 	});

// 	afterEach(function () {
// 	    return db.sync({force:true});
// 	});

// 	beforeEach(function() {
// 		return Match.create({
// 			winnerAccuracy: 92.5,
// 			loserAccuracy: 78.5,
// 			winnerStreak: 7,
// 			loserStreak: 1
			
// 		})
// 	});
// })