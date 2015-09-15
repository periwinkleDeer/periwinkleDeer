var router = require('./App');
var Rating = require('react-rating');
var Card = require('./Card').profileCard;

var Profile = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: ''};
  },

  componentDidMount: function() {
    $(".header-main__user-name").show();

    // On load, header plate image will rotate
    plateRotate();
    var self = this;

    // Saves the current route when user is on the profile page and refreshes  
    localStorage.setItem('currentRoute', '/profile');
    
    // Request to get current user's 5 recent restaurant items
    $.ajax({
      url: '/user/recent',
      method: 'GET',
      data: {id: self.props.query.id},
      success: function(data) {
        // Store the dishes in the state
        self.setState({dishes: 
          data.map(function(dish) {
            return <Card dish={dish} onClick={self.sendToFB.bind(self, dish.Dish.img_url)}/>
          })
        });
      },
      error: function(err) {
        console.log("err", err)
      }
    });
  
  },

  // On click, route the user to the /hist page
  handleClick: function(link) {
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },

  // Display facebook profile picture and button to go to history map
  render: function() {
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div>
            <center><img src={localStorage.getItem('profileUrl')} className="img-circle fb-profile" width="200" height="200" border="5"/></center>
            <center><button type="button" className="btn btn-warning btn-lg btn-block hist-btn" onClick={this.handleClick.bind(this, "hist")}>History Map</button></center>
          </div>
          <center><div><p className="usr-msg">Your 5 recent food ratings</p></div></center>
          <center><div>
            {this.state.dishes}
          </div></center>
        </div>
      </div>
    )
  }
})

module.exports = Profile;

