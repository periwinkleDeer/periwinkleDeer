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
      },
      order: [
        ['rating', 'DESC']
      ]
    }).then(function(results){
      res.send(results);
    });
  },

  get3Dishes: function(req, res){
    //this is an array of 3 dishIds
    // console.log("=============req.query============", req.query);
    var parsedDishes = [];
    req.query.restaurants.forEach(function(id){
        parsedDishes.push(parseInt(id));
    });
    // console.log("parsedDishes==============", parsedDishes);

    db.Dish.findAll({where: {
      id: {$in: parsedDishes}
    },
      include: [{
        model: db.Restaurant
      }]
    })
    .then(function(results){
      // console.log("get3Dishes results ===========", results);
      res.send(results);
    });
    
  },
  
  insertDish: function(req, res){
    // console.log("req.body === ", req.body);

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