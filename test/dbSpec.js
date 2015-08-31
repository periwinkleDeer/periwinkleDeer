var expect = require('expect.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('test', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool:{
    max: 5,
    min: 0,
    idle: 10000
  }
});
var db = require('../server/db');
var user = require('../server/userController');
var food = require('../server/foodController');

describe('userController', function() {
  var mockResponse = function(callback) {
    return { send: callback };
  };
  var newUser = {fb_id: "1486709991645691"};

  beforeEach(function(done) {
    sequelize.sync({force: true})
    .then(function() {done();});
  });

  it ("should find created users", function(done) {
    db.User.create(newUser).then(function() {
      user.findUser(newUser.fb_id)
      .then(function(user) {
        expect(user.fb_id).to.equal(newUser.fb_id);
        done();
      })
    })
  })
})