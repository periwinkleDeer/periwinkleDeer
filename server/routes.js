var food = require('./foodController')
var app = require('./server').app;

// //user related routes
//   app.get('/login', );
//   //retrieve user's last dishes
//   app.get('/findoradd', );
//   //rate dishes 
//   app.post('/findoradd', );
//   //user can upload dish
//   app.post('/add', );

//food related routes
  //get all dishes for appetizer, maincourse & dessert
  app.get('/dishes', food.displayAllFood);
  //when clicking on an individual item
  app.get('/dish', food.getFood);
  //when adding a dish to DB
  app.post('/insertdish', food.insertFood);