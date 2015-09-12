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
var Hist = require('./Hist');
var Display = require('./Display');
var Profile = require('./Profile');
var Restaurant = require('./Restaurant');
// var fbid = '391288257734536';
var fbid = '389293527934009';

localStorage.setItem('fbid', fbid);

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    // $('.header-main__user-avatar').hide();
    return {
      fbProfile: '',
      name: ''
    }
  },
  componentWillMount: function() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },

  componentDidMount: function() {
    plateRotate();
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
      localStorage.setItem('userId', response.authResponse.userID)
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

  handleClick: function() {
    var self = this;
    self.context.router.transitionTo('/profile', null, {
      id: FB.getUserID()
    });
  },

  render: function () {
    var self = this;
    var getProfile = function() {
      FB.getLoginStatus(function(response){
        if (response.status !== 'connected') {
          self.context.router.transitionTo('/login');
         } else {
          FB.api(
            "/" + response.authResponse.userID + "/picture?type=large",
            function (response) {
              if (response && !response.error) {
                /* handle the result */
                console.log(response.data)
                localStorage.setItem('profileUrl', response.data.url);
                self.setState({fbProfile: response.data.url});
                $('.header-main__user-avatar').show();
              } 
            }
          );
          FB.api('/me', function(response){
            var firstName = response.name.split(' ').slice(0, 1).join('');
            localStorage.setItem('username', firstName)
            localStorage.setItem('fb_id', FB.getUserID());
            self.setState({name: firstName});
          })

        }
      });
    };

    window.fbAsyncInit = function() {
      FB.init({
        appId      : fbid,
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
      // When user logins in, it should display a different page
      FB.Event.subscribe('auth.login', function (response) {
        console.log(response,"Logged")
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
        localStorage.setItem('fb_id', FB.getUserID());
        self.statusChangeCallback(response);

        getProfile();
      });

      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));


      getProfile();

    }.bind(this);

    // Insert facebook status check here


    return (
      <div>
        <div className="header-main">
          <div className="container2">
            <div className="header-main__inner">
              <div className="header-main__logo_fork">
                <a href={'#/main?id='+ localStorage.getItem('fb_id')}><img src="../assets/nibbler_icon_forkknife.png" alt=""></img></a>
              </div>
              <div className="header-main__logo">
                <a href={'#/main?id='+ localStorage.getItem('fb_id')}><img src="../assets/nibbler_icon_plate.png" alt=""></img></a>
              </div>
            
              <div className="header-main__user-name" onClick={this.handleClick.bind(this, 'profile')}>{this.state.name}</div>
              <div className="header-main__user-avatar">
                <img src={this.state.fbProfile} onClick={this.handleClick.bind(this, 'profile')}></img>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* this is the important part */}
          <RouteHandler/>
        </div>
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
    <Route name="hist" handler={Hist} />
    <Route name="display" handler={Display}/>
    <Route name="profile" handler={Profile}/>
    <Route name="restaurant" handler={Restaurant}/>
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

