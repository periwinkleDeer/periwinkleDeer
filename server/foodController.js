
var    Q    = require('q'),
    distance = require('google-distance-matrix'),
    GDMkey = require('./GDMkey'),
    db = require('./db');

  var findNearbyRestaurants = function(){
    // Geolocation will provide the origin address
    // Google Distance Matrix generates distances between origin and all restaurants in DB

    var origins = ['<insert geolocation data>'];
    var destinations = [];
    var restaurants = [];
    var GDM;

    db.Restaurant.findAll()
      .then(function(results){
        for(var j=0; j<results.length; j++){
          destinations.push(results[i].location);
          restaurants.push(results[i]);
        }
      });

    distance.key(GDMkey.API_key);
    distance.units('imperial');
     
    distance.matrix(origins, destinations, function (err, distances) {
      if (!err)
        console.log(distances);
        GDM = distances;
    });

    // Client sends a user-selected radius
    var radius = req.body.radius;
    var nearbyRestaurants = [];
    var nearbyRestaurantsIds = [];
    // Loop through GDM rows array
      // If distance is < radius push destination into nearbyRestaurants array
      // 'GDM' is a placeholder response obj
    for(var i=0; i<GDM.rows.length; i++){
      if(GDM.rows[0].elements[i].distance.value < radius){
        nearbyRestaurants.push(restaurants[i]);
        nearbyRestaurantsIds.push(restaurants[i].id);
      }
    }
    return nearbyRestaurantsIds;
  }; 

  var findDishes = function(Ids){
    var Dishes = [];
    db.Dish.findAll({where: 
      {rest_id: 
        {
          $in: Ids
        }
      }, include: [{model: Restaurant, required: true}]
    })
    .then(function(results){
      res.send(results);
    });
  };

//----------------------------------------------------------------------------

module.exports = {

  getDishList: function(req, res){
    res.send(req.query.zip)
    // findNearbyRestaurants()
    //   .then(function(results){
    //     findDishes(function(err, results){
    //       res.send(req.query.zipcode);
    //     });
    //   });
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

  // displayAllFood: function(req, res, next){
  //   // var category = req.query
  //   var dishes = {};

  //   var findAppetizers = Q.nbind(Food.find, Food);
  //   var findMaincourses = Q.nbind(Food.find, Food);
  //   var findDesserts = Q.nbind(Food.find, Food);

  //   findAppetizer({category: appetizer})
  //     .then(function (appetizers) {
  //       // console.log(appetizers);
  //       dishes[appetizers] = appetizers;
  //       return dishes;
  //     })
  //     .then(function(dishes){
  //       findMaincourses({category: maincourse})
  //         .then(function (maincourses){
  //           // console.log(maincourses);
  //           dishes[maincourses] = maincourses;
  //           return dishes;
  //         })
  //         .then(function (dishes){
  //           findDesserts({category: dessert})
  //             .then(function (desserts){
  //               // console.log(desserts);
  //               dishes[desserts] = desserts;
  //               return dishes;
  //             })
  //             .then(function(dishes){
  //               // console.log(dishes);
  //               res.send(dishes);
  //             });
  //         });
  //     });
  // }, 

  // getFood: function(req, res, next) {
  //   // console.log('inside getFriendsList');
  //   var dish = req.query.dish;
  //   // var category = req.query.category
  //   // console.log("req.query.dish ===== ", req.query.dish)

  //   var findFood = Q.nbind(Food.findOne, Food);
  //   findFood({dish: dish})
  //     .then(function (food) {
  //       // console.log(food);
  //       res.send(food);
  //     });
  // },

  // insertFood: function(req, res, next) {

  //   Food.findOne({dish: req.body.dish, restaurant: req.body.restaurant}, function(err, dish) {
  //     if(!dish){
  //       yelp.business("yelp-san-francisco", function(error, data) {
  //         // console.log(error);
  //         // console.log(data);
  //         var restInfo = data;

  //         Food.create({
  //           category: req.body.category,
  //           dish: req.body.dish,
  //           dishrating: req.body.dishrating,
  //           imgurl: req.body.imgurl,
  //           restaurant: req.body.restaurant,
  //           pricerating: req.body.pricerating,
  //           restrating: restInfo.rating,
  //           location: restInfo.location,
  //           phone: restInfo.phone
  //         });
          
  //       });
  //     }else{
  //       console.log(dish.dish, ' already exists');
  //     }
  //   });
  // },
};

