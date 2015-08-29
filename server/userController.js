var db = require('./db');

module.exports = {
  findUnrated: function(req, res) {
    var dishes = [];
    var index = 0;
    db.User.findOrCreate({where: {fb_id: req.query.id}})
      .then(function(user) {
        db.Rating.findAll({where: {user_id: user.id, rating: null}, include: [{model: Dish, required: true}]});
    });
  }
};

//Option 2
// Dish.find({user: user, rated: false}, function(err, res) {
//   return res;
// });
// }