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
      <div className="search col-md-3">
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}>Find</button>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.handleClick.bind(this, "entry")}>Add</button>
      </div>
    )
  }
});

module.exports = Main;