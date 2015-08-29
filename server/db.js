var Sequelize = require('sequelize');

var sequelize = new Sequelize('foodie', 'kshiraiw', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool:{
    max: 5,
    min: 0,
    idle: 10000
  }
});

var User = sequelize.define('User', {
  fb_id: Sequelize.STRING
});

var Rating = sequelize.define('Rating', {
  rating: Sequelize.INTEGER
});

var Dish = sequelize.define('Dish', {
  name: Sequelize.STRING,
  img_url: Sequelize.TEXT,
  category: Sequelize.STRING,
  price_rating: Sequelize.INTEGER,
  rating: Sequelize.INTEGER,
  num_ratings: Sequelize.INTEGER
});

var Restaurant = sequelize.define('Restaurant', {
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  rating: Sequelize.INTEGER,
  phone: Sequelize.STRING
});

User.hasMany(Rating);
Rating.belongsTo(User);

Dish.hasMany(Rating);
Rating.belongsTo(Dish);

Dish.belongsTo(Restaurant);
Restaurant.hasMany(Dish);

User.sync();
Restaurant.sync();
Dish.sync();
Rating.sync();

exports.User = User;
exports.Rating = Rating;
exports.Dish = Dish;
exports.Restaurant = Restaurant;