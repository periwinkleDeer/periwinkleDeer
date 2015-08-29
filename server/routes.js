var food = require('./foodController');
// var server = require('./server');
var user = require('./userController');
// var app = server.app;

module.exports = function(app) {
//food related routes
  //get all dishes for appetizer, maincourse & dessert
  app.get('/dishes', food.getDishList);
  //when clicking on an individual item
  // app.get('/dish', food.getFood);
  //when adding a dish to DB
  app.post('/insertdish', function(req, res) {
    console.log('hi');
    res.send('--->');
  }); 

//for specific users
  app.get('/unrated', user.findUnrated);
  app.post('/selecting', user.selectingDishes)
};