var fb = require('./login');
var router = require('./App');
var fbid = require('../fbid');
var Rating = require('react-rating');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: 'Loading...'}
  },
  componentDidMount: function() {
    this.ratings = {};
    var self = this;
    $.ajax({
        url: "/unrated",
        type: "GET",
        data: {id: self.props.query.id},
        success: function(data) {

          self.setState({dishes: 
            data.map(function(dish) {
              return (
              <div className="card">
                <div>{dish.Dish.name}</div>
                <img src={dish.Dish.img_url}/>
                <Rating empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={self.foodRate.bind(null, dish)}/>
                <span id={dish.id} className="glyphicon glyphicon-remove remove" onClick={self.handleRemove.bind(null, dish)}></span>
              </div>
                );
            })
          });
        },
        error: function(err) {
          console.log(err)
        }
      })

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    })
  },
  handleRemove: function(dish) { 
    $('#' + dish.id).parent().hide(400);
    this.ratings[dish.DishId] = -1;
  },
  foodRate: function(dish, value) {
    this.ratings[dish.DishId] = value;
  }, 
  handleSubmit: function() {
    var self = this;
    var query = {id: this.props.query.id};
    query.dishes = [];
    for (var prop in this.ratings) {
      query.dishes.push({id: prop, rating: this.ratings[prop]})
    }
    $.ajax({
      method: 'GET',
      url: '/rate',
      data: query,
      success: function(data) {
        self.componentDidMount();
      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  handleClick: function(link) {
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },
  render: function() {
      var self = this;
      var submit;
      if (this.state.dishes.length) {
        submit = 
          <div className="center-block">
            <button className="center-block btn btn-warning" onClick={this.handleSubmit}>
              Submit Ratings
            </button>
          </div>;
      } else {
        submit = '';
      }
      return (
        <div className="container">
          <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <div className="form-group">
              <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}>Search for Foodie!</button>
              <button type="button" className="btn btn-warning btn-lg btn-block spacing" onClick={this.handleClick.bind(this, "entry")}>Share Foodie!</button>
            </div>
            <div>
              {this.state.dishes}
            </div>
            {submit}
          </div>
        </div>
      );
    }
});

module.exports = Main;