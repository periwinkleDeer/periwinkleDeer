//your code here
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
  user: {type: Schema.ObjectId, ref: User},
  name: String,
  rated: Boolean,
  rating: Number
});

var userSchema = new Schema({
  username: String,
  dishes: [dishSchema]
});


var User = mongoose.model('User', userSchema);

module.exports = User;

//Finding all dishes that the user has not rated
// User.find({username: username, 'dishes.rated': 'false'}, function(err, res) 
//   return res;
// });

//Option 2
// Dish.find({user: user, rated: false}, function(err, res) {
//   return res;
// });

//Adding dishes to User
// User.update(
//   { 'username': username },
//   { "$push": { "dishes" : { name: name, rated: false, rating: 0}}},
//   function(err, numAffected) {
//     console.log(numAffected)
//   }
// )

//Updating ratings
// User.update(
//   {username: username, dishes.name: name},
//   {'$set': {'dishes.rated': true, 'dishes.rating': rating}},
//   function(err, numAffected) {
//     console.log(numAffected);
//   }
// );
