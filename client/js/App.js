var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;
var Login = require('./Login');
var Main = require('./Main');
var Entry = require('./Entry');
var Parameters = require('./Parameters');
var Map = require('./Map');
var Display = require('./Display');
var Profile = require('./Profile');
var fbid = '389293527934009';

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
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=" + fbid;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      console.log(localStorage.getItem('currentRoute'))
      if (localStorage.getItem('currentRoute')) {
        var currentRoute = localStorage.getItem('currentRoute');

        if (currentRoute === '/login') {
          this.context.router.transitionTo('/main', null, {id: FB.getUserID()});
          this.testAPI();
        }
      } 

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

  render: function () {

    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbid,
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
      // When user logins in, it should display a different page
      var self = this;
      FB.Event.subscribe('auth.login', function (response) {
        console.log(response,"Logged")
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
        self.statusChangeCallback(response);
      });


      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);
    
    // Insert facebook status check here


    return (
      <div>
        <div className="header-main">
          <div className="container2">
            <div className="header-main__inner">
              <div className="header-main__logo">
                <a><img src="../assets/nibbler_icon_01.png" alt=""></img></a>
              </div>
            </div>
          </div>
        </div>
        {/* this is the important part */}
        <RouteHandler/>
        <footer className="footer">
          <div className="container2">
            <h5 className="footer__heading">A <a className="footer__link" href="https://github.com/periwinkleDeer/periwinkleDeer" target="_blank">Periwinkle Deer</a> Production</h5>
            <h6 className="footer__copyright">&copy; 2015, Periwinkle Deer</h6>
          </div>
        </footer>
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
    <Route name="map" handler={Map} />
    <Route name="display" handler={Display}/>
    <Route name="profile" handler={Profile}/>
    <DefaultRoute handler={Login}/>
    <NotFoundRoute handler={Login} />
  </Route>
);

var appRouter = Router.create({
  routes: routes
});

appRouter.run(function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = appRouter;

