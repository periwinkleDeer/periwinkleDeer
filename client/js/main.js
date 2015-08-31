var fb = require('./login');
var router = require('./App');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var self = this;
    var user = {id: "1486709991645691"};
    return $.ajax({
        url: "/unrated",
        type: "GET",
        data: user,
        success: function(data) {
          console.log(data, 'posting');
          return {data: data};
        },
        error: function(err) {
          console.log(err)
        }
      })
  },

  handleClick: function(link) {
    console.log("btn click", this)
    this.context.router.transitionTo('/' + link)
  },
  render: function() {
    var self = this;
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div className="form-group">
            <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}>Search for Foodie!</button>
            <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.handleClick.bind(this, "entry")}>Share Foodie!</button>
          </div>
          <div>
            {self.state.data}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;