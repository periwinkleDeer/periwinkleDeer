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
    var self = this;
    $.ajax({
        url: "/unrated",
        type: "GET",
        data: {id: self.props.query.id},
        success: function(data) {
          console.log(data, 'posting');
          var dishes = [
            {'name': 'Sisig', 'rating': 4},
            {'name': 'Ravioli', 'rating': 2},
            {'name': 'Deep Dish Pizza', 'rating': 3}
          ];

          console.log(dishes);

          self.setState({dishes: 
            dishes.map(function(dish) {
              return (
              <div className="card">
                <div>{dish.name}</div>
                <Rating empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={self.foodRate}/>
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
  foodRate: function(value) {
    console.log(value);
  },


  handleClick: function(link) {
    console.log("btn click", this);
    this.context.router.transitionTo('/' + link);
  },
  render: function() {
    var self = this;
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
        </div>
      </div>
    );
  }
});

module.exports = Main;