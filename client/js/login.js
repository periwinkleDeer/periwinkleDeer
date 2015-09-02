var router = require('./App');
var fbid = require('../fbid');

var Login = React.createClass({  
  contextTypes: {
    router: React.PropTypes.func
  },

  componentWillMount: function() {
    localStorage.setItem('currentRoute', '/login');
  },

  login: function() {
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status === 'connected') {
        console.log("login PG")
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
      } else {
        FB.login();
      }
    });

    // FB.login(function(response){
    //   if (response.status === 'connected') {
    //     console.log("login PG")
    //     self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
    //   }
    // })
  },

  render: function(){
    return (
      <div className="container">
        <div className="panel col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.login}><img className="img-responsive" src={"../assets/facebooklogo.png"} />Login using Facebook</button>
        </div>
      </div>
    )
  }
});


module.exports = Login; 
