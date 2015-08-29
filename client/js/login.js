var router = require('./App');
var fbid = require('../fbid');

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=" + fbid.fbid;
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

  var Login = React.createClass({
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
      // When user logins in, it should display a different page
      var self = this;
      FB.Event.subscribe('auth.login', function (response) {
        console.log(response,"Logged")
        self.context.router.transitionTo('/options');
        self.statusChangeCallback(response);
      });

      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      // fjs.parentNode.insertBefore(js, fjs);
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
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.context.router.transitionTo('/options');
      this.testAPI();
      console.log(response)
      $.ajax({
        url: "/unrated",
        type: "POST",
        data: response.authResponse,
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

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState: function() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  },

  logOut: function() {
    FB.logout(function(response){
      console.log("Logged Out");
    });
  },

  render: function(){
    return (
      <center><div className="panel panel-default col-xs-2 col-sm-2 col-sm-offset-3">
        <div className="panel-heading">Login Using Facebook</div>
        <div className="panel-body">
          <center><div className="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="false">
          </div></center>
        </div>
        <a href="#" onClick={this.logOut}>Logout</a>
      </div></center>
      
      
    )
  }
});

module.exports = Login; 
