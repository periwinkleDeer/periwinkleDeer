var db = require('./db');

module.exports = {
  findUser: function(fb_id) {
    return db.User.find({where: {fb_id: fb_id}})
  }, 

  findUnrated: function(req, res) {
    db.User.findOrCreate({where: {fb_id: req.query.id}})
    .then(function(user) {
        return db.Rating.findAll({where: {UserId: user.id, rating: null}, include: [{model: db.Dish, required: true}]
        });
    }).then(function(results) {
      res.send(results);
    });
  },

  selectingDishes: function(req,res) {
    this.findUser(req.body.id)
    .then(function(user) {
      var storage = [];
      for (var i = 0; i < req.body.dishes; i++) {
        storage.push({UserId: user.id, DishId: req.body.dishes[i].id});
      }
      db.Rating.bulkCreate(storage);
    });
  },

  rateDish: function(req, res) {
    //updates ratings table
    this.findUser(req.body.id)
    .then(function(user) {
      db.Rating.findOne({
        UserId: user.id, DishId: req.body.dish
      })
      .then(function(dishRating) {
        dishRating.updateAttributes({rating: req.body.rating});
      })
    })

    //updates dishes table
    db.Dish.findOne({id: req.body.dish})
    .then(function(dish) {
      dish.updateAttributes({
        rating: (dish.get('rating') * dish.get('num_ratings') + req.body.rating)/(dish.get('num_ratings') + 1)
      });
      dish.increment('num_ratings');
    });
    res.send("Post successful");
  }, 

  deleteDish: function(req, res) {
    this.findUser(req.body.id)
    .then(function(user) {
      db.Rating.findOne({
        UserId: user.id,
        DishId: req.body.dish
      })
      .then(function(dishRating) {
        dishRating.destroy()
        .then(function() {
          res.send("Deleted");
        })
      })
    })
  }
 };

//Option 2
// Dish.find({user: user, rated: false}, function(err, res) {
//   return res;
// });
// }