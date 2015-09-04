var db = require('./db');


var rateDish = function(UserId, DishId, DishRating) {
  //updates ratings table
  db.Rating.findOne({
    where: {UserId: UserId, DishId: DishId}
  })
  .then(function(dishRating) {
    dishRating.updateAttributes({rating: DishRating});
  }).then(function() {
    return;
  });
};
  //updates dishes table
var updateDish = function(DishId, DishRating) {
  db.Dish.findOne({id: DishId})
  .then(function(dish) {
    dish.updateAttributes({
      rating: Math.round((parseInt(dish.get('rating')) * parseInt(dish.get('num_ratings')) + parseInt(DishRating))/(parseInt(dish.get('num_ratings')) + 1)).toString()
    });
    dish.increment('num_ratings');
  }).then(function() {
    return;
  });
}; 

var deleteDish = function(UserId, DishId) {
  db.Rating.findOne({
    UserId: UserId,
    DishId: DishId
  })
  .then(function(dishRating) {
    dishRating.destroy()
    .then(function() {
      return;
    })
  });
};

var findUser = function(fb_id) {
  return db.User.find({where: {fb_id: fb_id}})
}; 

module.exports = {
  findUnrated: function(req, res) {
    db.User.findOrCreate({where: {fb_id: req.query.id}})
    .then(function(user) {
      user = user[0].dataValues;
        return db.Rating.findAll({where: {UserId: user.id, rating: null}, include: [{model: db.Dish, required: true}]
        });
    }).then(function(results) {
      res.send(results);
    });
  },

  selectingDishes: function(req,res) {
    findUser(req.query.id)
    .then(function(user) {
      user = user.dataValues;
      console.log(req.query.dishes)
      var storage = [];
      for (var i = 0; i < req.query.dishes; i++) {
        db.Rating.findOrCreate({where: {UserId: user.id, DishId: req.query.dishes[i]}});
      }
    }).then(function(results) {
      res.send(req.query);
    });
  },

  ratings: function(req, res) {
    console.log(req.query)
    findUser(req.query.id)
    .then(function(user) {
      user = user.dataValues;
      req.query.dishes.forEach(function(dish) {
        if (dish.rating === "-1") {
          deleteDish(user.id, dish.id);
        } else {
          rateDish(user.id, dish.id, dish.rating)
          updateDish(dish.id, dish.rating);
        }
      })
      
    }).then(function() {
      res.send(req.query)
    })
  }

 };
