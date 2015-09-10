var Sequelize = require('sequelize');
var sequelize = null;

if(process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',

    pool:{
      max: 5,
      min: 0,
      idle: 10000
    }
  });

}else if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('test', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',

    pool:{
      max: 5,
      min: 0,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize('foodie', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',

    pool:{
      max: 5,
      min: 0,
      idle: 10000
    }
  });
}

var User = sequelize.define('User', {
  fb_id: {type: Sequelize.STRING, unique: true, allowNull: false}
});

var Rating = sequelize.define('Rating', {
  rating: Sequelize.STRING
});

var Dish = sequelize.define('Dish', {
  name: Sequelize.STRING,
  img_url: Sequelize.TEXT,
  category: Sequelize.STRING,
  price_rating: Sequelize.STRING,
  rating: Sequelize.STRING,
  num_ratings: Sequelize.INTEGER,
  zip: Sequelize.STRING,
  vegan: Sequelize.BOOLEAN,
  vegetarian: Sequelize.BOOLEAN,
  glutenfree: Sequelize.BOOLEAN,
  lactosefree: Sequelize.BOOLEAN
});

var Restaurant = sequelize.define('Restaurant', {
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  rating: Sequelize.STRING,
  phone: Sequelize.STRING,
  zip: Sequelize.STRING
});

global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User: User,
    Rating: Rating,
    Dish: Dish,
    Restaurant: Restaurant
  };


User.hasMany(Rating);
Rating.belongsTo(User);

Dish.hasMany(Rating);
Rating.belongsTo(Dish);

Dish.belongsTo(Restaurant);
Restaurant.hasMany(Dish);

// sequelize.sync({force: true});
// sequelize.sync();

exports.User = User;
exports.Rating = Rating;
exports.Dish = Dish;
exports.Restaurant = Restaurant;
module.exports = global.db;