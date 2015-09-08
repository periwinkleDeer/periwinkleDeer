var router = require('./App');
var Rating = require('react-rating');

var Profile = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {fbProfile: '', dishes: ''};
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
              <p><small><em>{dish.Dish.category}</em></small></p>
              <img className="img-thumbnail" src={dish.Dish.img_url}/>
              <div className="stars">
              <p>{dish.num_ratings} Reviews</p>
               <Rating initialRate={dish.rating} readonly="true" full="glyphicon glyphicon-star star orange" empty="glyphicon glyphicon-star-empty star"/>
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
          <div>
            <center><img src={localStorage.getItem('profileUrl')} className="img-circle img-responsive" width="200" height="200" border="5"/></center>
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

