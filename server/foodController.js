var db = require('./db');

module.exports = {

  getDishList: function(req, res){
    var price = req.query.price;
    var zip = req.query.zip;

    db.Dish.findAll({ 
      include: [{
        model: db.Restaurant, 
        required: true
      }],
      where: {
        price_rating: price,
        zip: zip
      }
    }).then(function(results){
      res.send(results);
    });
  },

  get3Dishes: function(req, res){
    //this is an array of 3 dishIds
    console.log("=============req.query============", req.query);
    var parsedDishes = [];
    req.query.restaurants.forEach(function(dish){
      for(var key in dish){
        parsedDishes.push(parseInt(dish[key]));
      }
    });
    console.log("parsedDishes==============", parsedDishes);

    db.Dish.findAll({where: {
      id: {$in: parsedDishes}
    },
      include: [{
        model: db.Restaurant
      }]
    })
    .then(function(results){
      console.log("get3Dishes results ===========", results);
      res.send(results);
    });
    
  },
  
  insertDish: function(req, res){
    // console.log("req.query === ", req.query);

    db.Restaurant.find({where: {
      name: req.query.restaurant,
      location: req.query.address,
      phone: req.query.phone,
      zip: req.query.zip
      }})
      .then(function(restaurant) {
        console.log("find Restaurant ===", restaurant);
        if(restaurant) {
          restaurant.updateAttributes({
            rating: req.query.resRating
          })
          .then(function(restaurant){
            // console.log("this is being passed to Dish.find === ", results);
            db.Dish.find({where: {
              name: {$iLike: req.query.dishName},
              RestaurantId: restaurant.dataValues.id
            }})
            .then(function(results){
              if(!results){
                db.Dish.create({
                  name: req.query.dishName,
                  category: req.query.category,
                  img_url: req.query.imgUrl,
                  price_rating: req.query.dishPrice,
                  rating: req.query.dishRating,
                  num_ratings: 1,
                  RestaurantId: restaurant.dataValues.id,
                  zip: restaurant.dataValues.zip
                })
                .then(function(results){
                  res.sendStatus(201);
                });
              }else{
                res.sendStatus(412);
              }
            }); 
          })
        }else{
          db.Restaurant.create({
            name: req.query.restaurant,
            location: req.query.address,
            rating: req.query.resRating,
            phone: req.query.phone,
            zip: req.query.zip
          }).then(function(results){
            // console.log("results from Restaurant.create === ", results);
            db.Dish.create({
              name: req.query.dishName,
              category: req.query.category,
              img_url: req.query.imgUrl,
              price_rating: req.query.dishPrice,
              rating: req.query.dishRating,
              num_ratings: 1,
              RestaurantId: results.dataValues.id,
              zip: results.dataValues.zip
            })
            .then(function(results){
              res.sendStatus(201);
            });
          });
        }
      });
  }
};