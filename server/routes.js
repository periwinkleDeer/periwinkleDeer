var pg = require('pg');
var food = require('./foodController');
// var server = require('./server');
var user = require('./userController');
// var app = server.app;

module.exports = function(app) {
//food related routes
  app.get('/dishes', food.getDishList);
  app.get('/get3dishes', food.get3Dishes);
  app.post('/insertdish', food.insertDish);
//for specific users
  app.get('/unrated', user.findUnrated);
  app.get('/selecting', user.selectingDishes);
  app.get('/rate', user.ratings);
  app.get('/recent', user.recent);
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