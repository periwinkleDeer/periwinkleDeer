var db = require('./db');


var rateDish = function(UserId, DishId, DishRating) {
  //updates ratings table
  db.Rating.findOne({
    where: {UserId: UserId, DishId: DishId}
  })
  .then(function(dishRating) {
    dishRating.updateAttributes({rating: DishRating});
  })
  .then(function() {
    updateDish(DishId, DishRating);
  });
};
  //updates dishes table
var updateDish = function(DishId, DishRating) {
  db.Dish.findOne({where: {id: DishId}})
  .then(function(dish) {
    var average = (parseInt(dish.get('rating')) * dish.get('num_ratings') + parseInt(DishRating))/(dish.get('num_ratings') + 1);
    var incremented = dish.get('num_ratings') + 1;
    dish.updateAttributes({
      rating: average.toString(),
      num_ratings: incremented
    });
  }).then(function() {
    return;
  });
}; 

var deleteDish = function(UserId, DishId) {
  db.Rating.findOne({where: 
    {UserId: UserId,
    DishId: DishId}
  })
  .then(function(dishRating) {
    dishRating.destroy();
  })
  .then(function() {
    return;
  });
};

var findUser = function(fb_id) {
  return db.User.find({where: {fb_id: fb_id}});
}; 

module.exports = {
  findUnrated: function(req, res) {
    db.User.findOrCreate({where: {fb_id: req.query.id}})
    .then(function(user) {
      user = user[0].dataValues;
      return db.Rating.findAll({
        where: {UserId: user.id, rating: null}, 
        include: [{model: db.Dish, required: true}],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    }).then(function(results) {
      res.send(results);
    });
  },

  selectingDishes: function(req,res) {
    findUser(req.query.id)
    .then(function(user) {
      user = user.dataValues;
      var count = 0;
      while (count < req.query.dishes.length) {
        db.Rating.findOrCreate({where: {UserId: user.id, DishId: req.query.dishes[count]}});
        count++;
      }
    }).then(function() {
      res.send(req.query);
    });
  },

  ratings: function(req, res) {
    findUser(req.body.id)
    .then(function(user) {
      user = user.dataValues;
      req.body.dishes.forEach(function(dish) {
        if (dish.rating === "-1") {
          deleteDish(user.id, dish.id);
        } else {
          rateDish(user.id, dish.id, dish.rating);
        }
      });
    }).then(function() {
      res.send(req.body);
    });
  },

  getHistory:function(req, res) {
    findUser(req.query.id)
    .then(function(user) {
      user = user.dataValues;
      return db.Rating.findAll({
        where: {UserId: user.id},
        include: [{model: db.Dish, required: true}],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    })
    .then(function(results) {
      var dishArray = [];
      results.forEach(function(dish) {
        dishArray.push(dish.dataValues.Dish.RestaurantId);
      });
      return db.Restaurant.findAll({
        where: {id: {$in: dishArray}}, 
        include: [{model: db.Dish, required: true}]
      });
    })
    .then(function(results) {
      res.send(results);
    });
  },

  recent: function(req, res) {
    findUser(req.query.id)
    .then(function(user) {
      user = user.dataValues;
      return db.Rating.findAll({
        where: {UserId: user.id},
        include: [{model: db.Dish, required: true}],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    })
    .then(function(results) {
      res.send(results);
    });
  }

 };
