process.env.NODE_ENV = 'test';
var request = require('supertest');
var expect = require('chai').expect;
var db = require('../server/db');


describe('loading express', function () {
  var server;
  before(function (done) {
    server = require('../server/server.js').server;
    db.sequelize.sync({force: true}).then(function () {
      return db.User.create({fb_id: '1486709991645691'})
    })
    .then(function(user) {
      db.Restaurant.create({name: 'Burger King', zip: '94122'})
    })
    .then(function(rest) {
      return db.Dish.create({ RestaurantId: 1, zip: '94122', price_rating: '1'})
    }).then(function(dish) {
      db.Rating.create({DishId: 1, UserId: 1})
    }).then(function() {
      done();
    })
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
    request(server)
      .post('/insertDish')
      .send({restaurant: 'Burger King', zip: '94122', dishPrice: '2'})
      .end(function(err, res) {
        db.Dish.findOne({price_rating: 2})
        .then(function(dish) {
          expect(dish.dataValues.zip).to.equal('94122');
          done(); 
        });
      });
  });

  // it ('responds to /get3dishes route', function chooseDishes(done) {
  //   request(server)
  //   .get('/get3dishes')
  //   .query({restaurants: [1]})
  //   .end(function(err, res) {
  //     console.log(res);
  //     done();
  //   })
  // })
  // it ('responds to /rating route', function ratingsRoute(done) {
  //   request(server)
  //   .get('/rate')
  //   .query({
  //     id: '1486709991645691', 
  //     dishes: [{id: 1, rating: '3'}, {id:2, rating: '1'}]
  //   })
  //   .end(function(err, res) {
  //     console.log(res)
  //     db.Rating.findOne({where: {DishId: 1, UserId: 1}})
  //     .then(function(rating) {
  //       // console.log(rating);
  //       expect(rating.dataValues.rating).to.equal('3');
  //     })
  //   })
  // })

  it('404 to nonexistant routes', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});