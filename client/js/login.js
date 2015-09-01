var router = require('./App');
var fbid = require('../fbid');

var Login = React.createClass({  
  contextTypes: {
    router: React.PropTypes.func
  },

  login: function() {
    var self = this;
    FB.login(function(response){
      console.log("In here",response);
      if (response.status === 'connected') {
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
      }
    })
  },

  render: function(){
    return (
      <div className="container">
        <div className="panel col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.login}><img className="facebook" src={"../assets/facebooklogo.png"} />Login using Facebook</button>
        </div>
      </div>
    )
  }
});


module.exports = Login; 
