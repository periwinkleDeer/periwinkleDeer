
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
    var restInfo;

    Restaurant.findOrCreate({where: {
      name: req.body.restaurant_name,
      rating: restInfo.rating,
      location: restInfo.location,
      phone: restInfo.phone
      }})
      .then(function(results){
        Dish.find({where: {
          name: req.body.dish_name,
          rest_id: results.id
        }})
        .then(function(results){
          console.log("results from Dish.find", results);
          if(!results){
            Dish.create({
              name: req.body.dish_name,
              category: req.body.category,
              img_url: req.body.img_url,
              rating: req.body.rating,
              restaurant: req.body.restaurant_name,
              price_rating: req.body.pricerating,
              rest_rating: restInfo.rating,
              location: restInfo.location,
              phone: restInfo.phone
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