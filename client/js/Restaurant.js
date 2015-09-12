var router = require('./App');
var Rating = require('react-rating');
var Card = require('./Card').restaurantCard;

var Restaurant = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: 'Loading...'};
  },
  componentDidMount: function() {
    plateRotate();
    var self = this;
    $.ajax({
      method: 'GET',
      url: '/food/resInfo',
      data: {resId: this.props.query.resId},
      success: function(data) {
        var dishes = self.handleDishes(data);
        self.setState({dishes: dishes});
      },
      error: function(err) {
        console.log(err);
      }
    });
    
    localStorage.setItem('currentRoute', '/parameters');
    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    });

  },
  handleRestaurant: function(data) {
    var restaurant = data[0].Restaurant;
    var phoneLinkArr = restaurant.phone.match(/\d+/g);
    if (phoneLinkArr) {
      var phoneLink = phoneLinkArr.join('');
    } else {
      restaurant.phone = '';
    }
    return(
      <div>
        <h1>{restaurant.name}</h1>
        <p><a target='_blank' href={'http://maps.google.com/?q=' + restaurant.location}>{restaurant.location}</a></p>
        <p><a href={'tel://'+ phoneLink}>{restaurant.phone}</a></p>
        <a target="_blank" href={"http://www.google.com/search?q=" + restaurant.name}><img className="glogo" src="../assets/google.png"/></a><Rating initialRate={parseInt(restaurant.rating)} readonly={true} full="readonly glyphicon glyphicon-star star orange" empty="readonly glyphicon glyphicon-star-empty star"/>
      </div>
    );
  },
  handleDishes: function(data) {
    var dishes = [];
    dishes.push(this.handleRestaurant(data))
    data.forEach(function(dish) {
      dishes.push(
        <Card dish={dish}/>
      );
    });
    return dishes;
  },
  render: function() {
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          {this.state.dishes}
        </div>
      </div>);
  }
});

module.exports = Restaurant;