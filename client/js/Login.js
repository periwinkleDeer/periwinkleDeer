var router = require('./App');

var Login = React.createClass({  
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    $(".header-main__user-name").hide();
    plateRotate();
    $(".header-main__inner").append('<center><div class="nibbler" style="margin-top:-42px;text-align:center;font-size:24px;top:5px;z-index:10;color:white">Nibbler</div></center>');

    function DoRotate(d) {
        $(".header-main__logo").css({
            transform: 'rotate(' + d + 'deg)'
        });
    }

    function AnimateRotate(d){
        var elem = $(".header-main__logo");

        $({deg: 0}).animate({deg: d}, {
            duration: 5000,
            step: function(now){
                elem.css({
                     transform: "rotate(" + now + "deg)"
                });
            }
        });
    }
    localStorage.setItem('currentRoute', '/login');
  },
  componentWillUnmount: function() {
    $(".nibbler").remove();
    console.log("unmounting")
  },

  login: function() {
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status === 'connected') {
        self.context.router.transitionTo('/main', null, {id: FB.getUserID()});
      } else {
        if( navigator.userAgent.match('CriOS') || !!navigator.userAgent.match(/Trident.*rv[ :]*11\./)) {
          window.open('https://www.facebook.com/dialog/oauth?client_id='+ localStorage.getItem('fbid') +'&redirect_uri='+ document.location.href);
        } else {
          FB.login();
        }
      }
    });

  },


  render: function(){
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <button type="button" className="btn btn-warning btn-lg btn-block fb-button upload" onClick={this.login}><img className="fb-logo" src={"../assets/facebooklogo.png"} />  Login with Facebook</button>
        </div>
      </div>
    )
  }
});


module.exports = Login; 
