var Food = require('./foodModel'),
    Q    = require('q'),
    yelp = require("yelp"),
    yelpkey = require('./yelpkey');

yelp.createClient({
  consumer_key: yelpkey.consumerkey,
  consumer_secret: yelpkey.consumersecret,
  token: yelpkey.token,
  token_secret: yelpkey.tokensecret
});

module.exports = {

  displayAllFood: function(req, res, next){
    
    
    // var category = req.query
    // var dishes = {};

    // var findAppetizers = Q.nbind(Food.find, Food);
    // var findMaincourses = Q.nbind(Food.find, Food);
    // var findDesserts = Q.nbind(Food.find, Food);

    // findAppetizer({category: appetizer})
    //   .then(function (appetizers) {
    //     // console.log(appetizers);
    //     dishes[appetizers] = appetizers;
    //     return dishes;
    //   })
    //   .then(function(dishes){
    //     findMaincourses({category: maincourse})
    //       .then(function (maincourses){
    //         // console.log(maincourses);
    //         dishes[maincourses] = maincourses;
    //         return dishes;
    //       })
    //       .then(function (dishes){
    //         findDesserts({category: dessert})
    //           .then(function (desserts){
    //             // console.log(desserts);
    //             dishes[desserts] = desserts;
    //             return dishes;
    //           })
    //           .then(function(dishes){
    //             // console.log(dishes);
    //             res.send(dishes);
    //           });
    //       });
    //   });
  }, 

  getFood: function(req, res, next) {
    // console.log('inside getFriendsList');
    var dish = req.query.dish;
    // var category = req.query.category
    // console.log("req.query.dish ===== ", req.query.dish)

    var findFood = Q.nbind(Food.findOne, Food);
    findFood({dish: dish})
      .then(function (food) {
        // console.log(food);
        res.send(food);
      });
  },

  insertFood: function(req, res, next) {

    Food.findOne({dish: req.body.dish, restaurant: req.body.restaurant}, function(err, dish) {
      if(!dish){
        yelp.business("yelp-san-francisco", function(error, data) {
          // console.log(error);
          // console.log(data);
          var restInfo = data;

          Food.create({
            category: req.body.category,
            dish: req.body.dish,
            dishrating: req.body.dishrating,
            imgurl: req.body.imgurl,
            restaurant: req.body.restaurant,
            pricerating: req.body.pricerating,
            restrating: restInfo.rating,
            location: restInfo.location,
            phone: restInfo.phone
          });
          
        });
      }else{
        console.log(dish.dish, ' already exists');
      }
    });
  },
};

