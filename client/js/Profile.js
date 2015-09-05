var router = require('./App');

var Profile = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    localStorage.setItem('currentRoute', '/profile');
    var self = this;

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      } else {
        console.log("YO")
        FB.api(
          "/" + response.authResponse.userID + "/picture?width=180height=180",
          function (response) {
            if (response && !response.error) {
              /* handle the result */
              console.log(response.data.url)
            }
          }
        );
      }
    });


  },

  render: function() {
    return (
      <div>
        Hello Profile
      </div>
    )
  }
})

module.exports = Profile;

