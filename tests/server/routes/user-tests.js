const expect = require('chai').expect;

const Sequelize = require('sequelize');

const db = require('../../../server/db');
	const User = db.model('user')
const supertest = require('supertest');
const app = require('../../../server/app')(db)
const agent = supertest.agent(app)



describe('User Routes', function() {

	let theUser;
	before(function () {
	    return db.sync({force: true});
	});

	afterEach(function () {
	    return db.sync({force:true});
	});


	beforeEach(function() {
		return User.create({
			email: "test@test.com",
			username: "testy",
			longestStreak: 2,
			wins: 0,
			losses: 1,
			averageAccuracy: 0.0,
			password: "Booger!"
		})
		.then(user => {
			theUser = user
			return User.create({
				email: "test@test1.com",
				username: "testy1",
				longestStreak: 2,
				wins: 0,
				losses: 1,
				averageAccuracy: 0.0,
				password: "Booger!3"
			})
		})
	});	


	describe('Gets', function() {

		it('all users', function(done) {
			agent
			.get('/api/users')
			.expect(200)
			.end(function(err,res) {
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				expect(res.body).to.be.have.length(2);
				done();
			});
			
		});

		it('one user', function(done) {
			agent
			.get('/api/users/' + theUser.id)
			.expect(200)
			.end(function(err,res) {
				if(err) return done(err);
				expect(res.body.email).to.equal(theUser.email)
				done();
				
			});
		})
	});

	describe("Posts",function() {
		it("adds a user to the database", function(done) {
			agent
			.post('/api/users')
			.send({
				email: "test2@test.com",
				username: "testy2",
				longestStreak: 2,
				wins: 1,
				losses: 1,
				averageAccuracy: 0.0,
				password: "Booger!2"
			})
			.expect(201)
			.end(function(err,res) {
				if(err) return done(err);
					expect(res.body.email).to.equal("test2@test.com");
					expect(res.body.id).to.exist;
					User.findById(res.body.id)
					.then(function(user) {
						expect(user).to.not.be.null;
						expect(res.body.email).to.eql(user.email);
						done();
					})
				.catch(done);
				});

		});
	});

	describe("Puts", function() {
		it("updates a user's info", function(done) {
			agent
			.put('/api/users/')
			.send({
				username: 'updateName'
			})
			.expect(200)
			.end(function(err,res) {
				if(err) return done(err);
				expect(res.body.username).to.equal('updateName');
				User.findById(theUser.id)
				.then(function(user) {
					expect(user).to.not.be.null;
					expect(res.body.username).to.eql('updateName');
					done();
				})
			});
		});
	});

});