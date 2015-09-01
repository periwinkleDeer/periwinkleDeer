var fb = require('./login');
var router = require('./App');
var fbid = require('../fbid');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  componentDidMount: function() {
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    })
  },


  handleClick: function(link) {
    console.log("btn click", this)
    this.context.router.transitionTo('/' + link)
  },
  render: function() {
    console.log("DATA", this.props.query.dishes)
    var dishes = this.props.query.dishes.map(function(dish) {
      return <div class="card">{dish.name}</div>
    });
    console.log(dishes)
    var self = this;
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div className="form-group">
            <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}>Search for Foodie!</button>
            <button type="button" className="btn btn-warning btn-lg btn-block spacing" onClick={this.handleClick.bind(this, "entry")}>Share Foodie!</button>
          </div>
          <div>
            {dishes}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;