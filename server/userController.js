var db = require('./db');

module.exports = {
  findUnrated: function(req, res) {
    db.User.findOrCreate({where: {fb_id: req.query.id}})
    .then(function(user) {
        return db.Rating.findAll({where: {userId: user.id, rating: null}, include: [{model: Dish, required: true}]
        });
    }).then(function(results) {
      res.send(results);
    });
  },

  selectingDishes: function(req,res) {
    db.User.find({where: {fb_id: req.body.id}})
    .then(function(user) {
      for (var i = 0; i < req.body.dishes; i++) {
        db.Rating.create({UserId: user.id, DishId: req.body.dishes[i].id})
      }
    });
  }
};

//Option 2
// Dish.find({user: user, rated: false}, function(err, res) {
//   return res;
// });
// }