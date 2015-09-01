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
 
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  testAPI: function() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
    });
  },

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback: function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.context.router.transitionTo('/main');
      this.testAPI();

      var user = {};
      user.id = response.authResponse.userID;

      $.ajax({
        url: "/unrated",
        type: "GET",
        data: user,
        success: function(data) {
          console.log(data, 'posting');
        },
        error: function(err) {
          console.log(err)
        }
      })

    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // document.getElementById('status').innerHTML = 'Please log ' +
        // 'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      // document.getElementById('status').innerHTML = 'Please log ' +
      // 'into Facebook.';
    }
  },

  logOut: function() {
    FB.logout(function(response) {
        console.log(response);
      })
  },

  render: function () {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=" + fbid.fbid;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbid.fbid,
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
      // When user logins in, it should display a different page
      var self = this;
      FB.Event.subscribe('auth.login', function (response) {
        console.log(response,"Logged")
        self.context.router.transitionTo('/main');
        self.statusChangeCallback(response);
      });

      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);
    
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
    <Route name="login" handler={Login}/>
    <Route name="main" handler={Main}/>
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

