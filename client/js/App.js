var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Login = require('./Login');
var Main = require('./Main');
var Entry = require('./Entry');
var Parameters = require('./Parameters');


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
  componentWillMount: function() {
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

