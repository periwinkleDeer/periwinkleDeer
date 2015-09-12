var Rating = require('react-rating');
//dish view for display route
var DisplayCard = React.createClass({
  render: function() {
    return (
      <section id={this.props.item.id} className="slide">
        <p><strong>{this.props.item.name}</strong> <span className="green">{displayMoney(this.props.item.price_rating)}</span></p>
        <a href={'#/restaurant?resId=' + this.props.item.Restaurant.id}className="restaurant-name"><em>{this.props.item.Restaurant.name}</em></a>
        <img className="img-thumbnail picture" onClick={this.props.onClick} data-lazy={this.props.item.img_url}/>
        <p>{this.props.item.num_ratings} Reviews</p>
        <Rating initialRate={parseInt(this.props.item.rating)} readonly={true} full="readonly glyphicon glyphicon-star star orange" empty="readonly glyphicon glyphicon-star-empty star"/>
      </section>
    );
  }
});

module.exports.displayCard = DisplayCard;

//converts price rating to dollar signs
var displayMoney = function(num) {
  var string = '';
  for (var i = 0; i < parseInt(num); i++) {
    string += '$';
  }
  return string;
};

//dish view for restaurant route
var RestaurantCard = React.createClass({
  render: function() {
    return(
      <div className="card">
        <div><strong>{this.props.dish.name}</strong> <span className="green">{displayMoney(this.props.dish.price_rating)}</span></div>
        <p><small><em>{this.props.dish.category}</em></small></p>
        <center><img className="img-thumbnail" src={this.props.dish.img_url}/></center>
        <div className="stars">
        <p>{this.props.dish.num_ratings} Reviews</p>
         <Rating initialRate={parseInt(this.props.dish.rating)} readonly={true} full="readonly glyphicon glyphicon-star star orange" empty="readonly glyphicon glyphicon-star-empty star"/>
        </div>
      </div>
    );
  }
});

module.exports.restaurantCard = RestaurantCard;

var ProfileCard = React.createClass({
  render: function() {
    return (
    <div className="card">
      <div><strong>{this.props.dish.Dish.name}</strong></div>
      <p><small><em>{this.props.dish.Dish.category}</em></small></p>
      <center><a href={'#/restaurant?resId=' + this.props.dish.Dish.RestaurantId}>More from this Restaurant</a></center>
      <img className="img-thumbnail" src={this.props.dish.Dish.img_url}/>
      <div className="stars">
      <p>{this.props.dish.Dish.num_ratings} Reviews</p>
       <Rating initialRate={parseInt(this.props.dish.Dish.rating)} readonly={true} full="readonly glyphicon glyphicon-star star orange" empty="readonly glyphicon glyphicon-star-empty star"/>
      </div>
    </div>
      );
  }
});

module.exports.profileCard = ProfileCard;