var db = require('./db');

module.exports = {

  getDishList: function(req, res){
    var price = req.query.price;
    var zip = req.query.zip;

    db.Dish.findAll({where: {
      price_rating: price}, 
      include: [{
        model: db.Restaurant, 
        where: {zip: zip}, 
        required: true
      }]
    }).then(function(results){
      res.send(results);
    });
  },

  // TODO add data to restInfo from Google Places API
  insertDish: function(req, res){
    // console.log("req.query === ", req.query);

    db.Restaurant.find({where: {
      name: req.query.restaurant,
      location: req.query.address,
      phone: req.query.phone,
      zip: req.query.zip
      }})
      .then(function(restaurant) {
        // console.log("find Restaurant ===", restaurant);
        if(restaurant) {
          restaurant.updateAttributes({
            rating: req.query.resRating
          })
          .then(function(results){
            // console.log("this is being passed to Dish.find === ", results);
            db.Dish.find({where: {
              name: req.query.dishName,
              RestaurantId: results.dataValues.id
            }})
            .then(function(results){
              // console.log("results from Dish.find === ", results);
              if(!results){
                db.Dish.create({
                  name: req.query.dishName,
                  category: req.query.category,
                  img_url: req.query.imgUrl,
                  price_rating: req.query.dishPrice,
                  rating: req.query.dishRating,
                  num_ratings: 1
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
              num_ratings: 1
            })
            .then(function(results){
              res.sendStatus(201);
            });
          });
        }
      });
  }
};