var fb = require('./login');
var router = require('./App');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  handleClick: function(link) {
    console.log("btn click", this)
    this.context.router.transitionTo('/' + link)
  },
  render: function() {
    return (
      <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
        <div className="form-group">
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}>Search for Foodie!</button>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.handleClick.bind(this, "entry")}>Share Foodie!</button>
        </div>
      </div>
    )
  }
});

module.exports = Main;