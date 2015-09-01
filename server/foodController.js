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
    console.log("req ==================== ", req);

    db.Restaurant.findOrCreate({where: {
      name: req.body.restaurant,
      location: req.body.address,
      phone: req.body.phone,
      zip: req.body.zip
      }})
      .then(function(restaurant) {
        restaurant.updateAttributes({
          rating: req.body.rating
        });
      })
      .then(function(results){
        console.log("is this returning a restaurant? INSERT DISH FUNCTION ", results);
        db.Dish.find({where: {
          name: req.body.dishName,
          RestaurantId: results.id
        }})
        .then(function(results){
          console.log("results from Dish.find INSERT DISH FUNCTION", results);
          if(!results){
            db.Dish.create({
              name: req.body.dishName,
              category: req.body.category,
              img_url: req.body.imgUrl,
              price_rating: req.body.pricerating,
              rating: req.body.dishRating,
              num_ratings: 1
            }).then(function(results){
              res.sendStatus(201);
            });
          }else{
            res.sendStatus(412);
          }
        });  
      });
  }
};