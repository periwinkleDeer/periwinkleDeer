var pg = require('pg');
var food = require('./foodController');
// var server = require('./server');
var user = require('./userController');
// var app = server.app;

module.exports = function(app) {
//food related routes
  app.get('/food/dishes', food.getDishList);
  app.get('/food/3dishes', food.get3Dishes);
  app.post('/food/newDish', food.insertDish);
  app.get('/food/resInfo', food.resInfo);
//for specific users
  app.get('/user/unrated', user.findUnrated);
  app.post('/user/selections', user.selectingDishes);
  app.post('/user/ratings', user.ratings);
  app.get('/user/recent', user.recent);
  app.get('/user/history', user.getHistory);
//Heroku deployment
  app.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM "Dishes"', function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { response.render('pages/db', {results: result.rows} ); }
      });
    });
  });
};