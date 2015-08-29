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
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="inbox">Inbox</Link></li>
            <li><Link to="Entry">Entry</Link></li>
            <li><Link to="parameters">Parameters</Link></li>
          </ul>
          Logged in as Jane
        </header>

        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="inbox" handler={Main}/>
    <Route name="Entry" handler={Entry}/>
    <Route name="parameters" handler={Parameters} />
    <DefaultRoute handler={Login}/>
  </Route>
);

// Router.run(routes, function (Handler) {
//   React.render(<Handler/>, document.body);
// });

var appRouter = Router.create({
  routes: routes,
  location: Router.HistoryLocation,
});

appRouter.run(function (Handler) {
  React.render(<Handler/>, document.body);
});

// module.exports.transitionTo = function (to, params, query) {
//   console.log("transition to " + to);
//   router.transitionTo(to, params, query);
// };

module.exports = appRouter;

