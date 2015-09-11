var db = require('./db');

var createQuery = function(query) {
  var price = query.price || '4';
  var sqlQuery = {
    price_rating: {$lte: price},
    zip: query.zip
  };

  for (var prop in query) {
    if (query[prop] === 'true') {
      sqlQuery[prop] = true;
    }
  }
  return sqlQuery;
}

module.exports = {

  resInfo: function(req, res) {
    var rest = req.query.resId;
    db.Dish.findAll({
      include: [{
        model: db.Restaurant, 
        required: true
      }],
      where: {RestaurantId: rest}
    })
    .then(function(dishes) {
      res.send(dishes);
    });
  },

  getDishList: function(req, res){
    var query = createQuery(req.query);

    db.Dish.findAll({ 
      include: [{
        model: db.Restaurant, 
        required: true
      }],
      where: query,
      order: [
        ['rating', 'DESC']
      ]
    }).then(function(results){
      res.send(results);
    });
  },

  get3Dishes: function(req, res){
    var parsedDishes = [];
    req.query.restaurants.forEach(function(id){
        parsedDishes.push(parseInt(id));
    });

    db.Dish.findAll({where: {
      id: {$in: parsedDishes}
    },
      include: [{
        model: db.Restaurant
      }]
    })
    .then(function(results){
      res.send(results);
    });
    
  },
  
  insertDish: function(req, res){
    db.Restaurant.find({where: {
      name: req.body.restaurant,
      location: req.body.address,
      phone: req.body.phone,
      zip: req.body.zip
      }})
      .then(function(restaurant) {
        // console.log("find Restaurant ===", restaurant);
        if(restaurant) {
          restaurant.updateAttributes({
            rating: req.body.resRating
          })
          .then(function(restaurant){
            // console.log("this is being passed to Dish.find === ", results);
            db.Dish.find({where: {
              name: {$iLike: req.body.dishName},
              RestaurantId: restaurant.dataValues.id
            }})
            .then(function(results){
              if(!results){
                db.Dish.create({
                  name: req.body.dishName,
                  category: req.body.category,
                  img_url: req.body.imgUrl,
                  price_rating: req.body.dishPrice,
                  rating: req.body.dishRating,
                  num_ratings: 1,
                  RestaurantId: restaurant.dataValues.id,
                  zip: restaurant.dataValues.zip,
                  vegan: (req.body.vegan === 'true'),
                  vegetarian: (req.body.vegetarian === 'true'),
                  glutenfree: (req.body.glutenfree === 'true'),
                  lactosefree: (req.body.lactosefree === 'true')
                })
                .then(function(dish){
                  db.User.findOne({where: {fb_id: req.body.id}})
                  .then(function(user) {
                    db.Rating.create({UserId: user.id, DishId: dish.id, rating: req.body.dishRating});
                  }).then(function(results) {
                    res.sendStatus(201);
                  });
                });
              }else{
                res.sendStatus(412);
              }
            }); 
          })
        }else{
          db.Restaurant.create({
            name: req.body.restaurant,
            location: req.body.address,
            rating: req.body.resRating,
            phone: req.body.phone,
            zip: req.body.zip
          }).then(function(results){
            // console.log("results from Restaurant.create === ", results);
            db.Dish.create({
              name: req.body.dishName,
              category: req.body.category,
              img_url: req.body.imgUrl,
              price_rating: req.body.dishPrice,
              rating: req.body.dishRating,
              num_ratings: 1,
              RestaurantId: results.dataValues.id,
              zip: results.dataValues.zip,
            vegan: (req.body.vegan === 'true'),
                  vegetarian: (req.body.vegetarian === 'true'),
                  glutenfree: (req.body.glutenfree === 'true'),
                  lactosefree: (req.body.lactosefree === 'true')
            })
            .then(function(dish){
              db.User.findOne({where: {fb_id: req.body.id}})
              .then(function(user) {
                db.Rating.create({UserId: user.id, DishId: dish.id, rating: req.body.dishRating})
                  .then(function(results) {
                    res.sendStatus(201);
                  })
              })
            });
          });
        }
      });
  }
};