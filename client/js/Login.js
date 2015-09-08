var router = require('./App');

var Login = React.createClass({  
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    localStorage.setItem('currentRoute', '/login');
  },

  login: function() {
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status === 'connected') {
        console.log("login PG")
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
      } else {
        if( navigator.userAgent.match('CriOS') ) {
          window.open('https://www.facebook.com/dialog/oauth?client_id='+ localStorage.getItem('fbid') +'&redirect_uri='+ document.location.href);
        }
        else {
          FB.login();
        }
      }
    });

  },


  render: function(){
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <button type="button" className="btn btn-warning btn-lg btn-block fb-button" onClick={this.login}><img className="fb-logo" src={"../assets/facebooklogo.png"} />Login using Facebook</button>
        </div>
      </div>
    )
  }
});


module.exports = Login; 
