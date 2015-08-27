var mongoose = require('mongoose'),

var FoodSchema = new mongoose.Schema({
  category: {
    type: String,
    default: ''
  },

  dish: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true
  },

  dishrating: {
    type: Number,
    default: 0
  },

  imgurl: {
    type: String,
    default: ''
  },

  restaurant: {
    type: String,
    default: '',
    lowercase: true
  },

  pricerating: {
    type: Number,
    default: 0
  },

  //these two will come from Yelp API
  restrating: {
    type: Number,
    default: 0
  },

  location: {
    type: String,
    location: ''
  },

  phone: {
    type: String,
    default: ''
  }
});

// FoodSchema.methods.something = function (entersomething) {}

module.exports = mongoose.model('food', FoodSchema);