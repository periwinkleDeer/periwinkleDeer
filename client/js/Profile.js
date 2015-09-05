var router = require('./App');

var Profile = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {fbProfile: ""};
  },

  componentDidMount: function() {
    localStorage.setItem('currentRoute', '/profile');
    var self = this;

    // Getting user's recent visits
    // $.ajax({
    //   url: '/recent',
    //   method: 'GET',
    //   data: {id: self.props.query.id},
    //   success: function(data) {
    //     console.log(data);
    //   }

    // })

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      } else {
        console.log("YO")
        FB.api(
          "/" + response.authResponse.userID + "/picture",
          function (response) {
            if (response && !response.error) {
              /* handle the result */
              console.log(response.data.url)
              self.setState({fbProfile: response.data.url});
            } 
          }
        );
      }
    });


  },

  render: function() {
    return (
      <div>
        <img src={this.state.fbProfile} className="img-circle" />
      </div>
    )
  }
})

module.exports = Profile;

