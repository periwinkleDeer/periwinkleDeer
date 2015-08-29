var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Login = require('./Login');
var Main = require('./Main');
var Entry = require('./Entry');
var Parameters = require('./Parameters');
var fbid = require('../fbid');


var Inbox = React.createClass({
  render: function () {
    return (
      <div>
      </div>
    );
  }
});

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  componentDidMount: function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbid.fbid,
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
    }
  },
  render: function () {
    return (
      <div>
        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="options" handler={Main}/>
    <Route name="entry" handler={Entry}/>
    <Route name="parameters" handler={Parameters} />
    <DefaultRoute handler={Login}/>
  </Route>
);

var appRouter = Router.create({
  routes: routes
});

appRouter.run(function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = appRouter;

