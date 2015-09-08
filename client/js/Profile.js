var router = require('./App');
var Rating = require('react-rating');

var Profile = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {fbProfile: '', dishes: '', fbID: ''};
  },

  componentDidMount: function() {
    var self = this;
    
    localStorage.setItem('currentRoute', '/profile');
    
    $.ajax({
      url: '/recent',
      method: 'GET',
      data: {id: self.props.query.id},
      success: function(data) {
        self.setState({dishes: 
          data.map(function(dish) {
            return (
            <div className="card">
              <div><strong>{dish.Dish.name}</strong></div>
              <img src={dish.Dish.img_url}/>
              <div className="stars">
                <Rating initialRate={dish.Dish.rating} empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" />
              </div>
            </div>
              );
          })
        });
      },
      error: function(err) {
        console.log("err", err)
      }
    });
  
  },

  render: function() {
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div className="fb-profile">
            <center><img src={localStorage.getItem('profileUrl')} className="img-circle img-responsive" width="200" height="200" /></center>
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

