process.env.NODE_ENV = 'test';
var request = require('supertest');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var app = require('express')();
var cors = require('cors');
var db = require('../server/db');
app.use(cors());
app.use(bodyParser.urlencoded());


describe('loading express', function () {
  var server;
  before(function (done) {
    server = require('../server/server.js').server;
    db.sequelize.sync({force: true}).then(function () {
      return db.User.create({fb_id: '1486709991645691'});
    })
    .then(function(user) {
      db.Restaurant.create({name: 'Burger King', location: ':)', phone: '626', zip: '94122'});
    })
    .then(function(rest) {
      return db.Dish.create({ RestaurantId: 1, zip: '94122', price_rating: '1', glutenfree: 'false', vegan: 'false', vegetarian: 'false', lactosefree: 'false'});
    }).then(function(dish) {
      db.Rating.create({DishId: 1, UserId: 1});
    }).then(function() {
      done();
    });
  });

  after(function () {
      server.close();
  });

  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });

  it('responds to /unrated route', function unratedroutes(done) {
    request(server)
      .get('/unrated')
      .query({id: '1486709991645691'})
      .end(function(err, res) {
        if (err) {return done(err);}
        expect(res.body[0].Dish.zip).to.equal('94122');
        done();
      });
  });

  it ('responds to /dishes route', function dishesRoute(done) {
    request(server)
      .get('/dishes')
      .query({zip: '94122', price: '1'})
      .end(function(err, res) {
        expect(res.body[0].id).to.equal(1);
        done();
      });
  });


  it ('responds to /insertDish route', function insertDishRoute(done) {
    var dish= {id: '1486709991645691', restaurant: 'Burger King', address: ':)', phone: '626', zip: '94122', dishPrice: '2', dishRating: '3', glutenfree: 'false', vegan: 'false', vegetarian: 'true', lactosefree: 'false'};
    request(server)
      .post('/insertDish')
      .type('form')
      .send(dish)
      .end(function(err, res) {
        if (err) {return done(err);}
        db.Dish.findOne({where: {price_rating: '2'}})
        .then(function(dish) {
          expect(dish.dataValues.zip).to.equal('94122');
        })
        .then(function() {
          db.Rating.findOne({where: {UserId: 1, DishId: 2}})
          .then(function(rating) {
            expect(rating.dataValues.rating).to.equal('3');
            done();
          });
        });
      });
  });

  it ('responds to /dishes route with no price', function dishesRoute(done) {
    request(server)
      .get('/dishes')
      .query({zip: '94122', price: null})
      .end(function(err, res) {
        expect(res.body.length).to.equal(2);
        done();
      });
  });

  it ('responds to /dishes route with vegetarian query', function vegequery(done) {
    request(server)
      .get('/dishes')
      .query({zip: '94122', price: null, vegetarian: true})
      .end(function(err,res) {
        expect(res.body[0].id).to.equal(2);
        done();
      });
  });

  it ('responds to selecting route', function selectingRoute(done) {
    request(server)
      .get('/selecting')
      .query({id: '1486709991645691', dishes: [2]})
      .end(function(err, res) {
        db.Rating.findOne({DishId: 2})
        .then(function(rating) {
          expect(rating.UserId).to.equal(1);
          done();
        });
      });
  });

  it ('only allows one rating', function selectingRoute(done) {
  request(server)
    .get('/selecting')
    .query({id: '1486709991645691', dishes: [1,2]})
    .end(function(err, res) {
      db.Rating.findAll({where: {UserId: 1, DishId: 2}})
      .then(function(ratings) {
        expect(ratings.length).to.equal(1);
      }).then(function() {
        db.Rating.findAll({where: {UserId:1, DishId: 1}})
          .then(function(ratings) {
          expect(ratings.length).to.equal(1);
          done();
        });
      });
    });
  });

  it ('responds to recent route', function recentRoute(done) {
    request(server)
    .get('/recent')
    .query({id: '1486709991645691'})
    .end(function(err, res) {
      expect(res.body.length).to.equal(2);
      done();
    });
  });

  it ('responds to resInfo Route', function resInfo(done) {
    request(server)
    .get('/resInfo')
    .query({resId: 1})
    .end(function(err, res) {
      expect(res.body.length).to.equal(2);
      done();
    });
  });
  
  it('404 to nonexistant routes', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});