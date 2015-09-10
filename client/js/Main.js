var router = require('./App');
var Rating = require('react-rating');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: 'Loading...'}
  },
  componentDidMount: function() {
    $(document).ready(function () {
        DoRotate(360);
        AnimateRotate(360);
    });

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
    this.ratings = {};
    var self = this;
    localStorage.setItem('fb_id', this.props.query.id);
    $.ajax({
        url: "/unrated",
        type: "GET",
        data: {id: self.props.query.id},
        success: function(data) {
          self.setState({dishes: 
            data.map(function(dish) {
              return (
              <div className="card">
                <div><strong>{dish.Dish.name}</strong></div>
                <p><em><small>{dish.Dish.category}</small></em></p>
                <center><img className="img-thumbnail" src={dish.Dish.img_url}/></center>
                <div className="stars">
                  <Rating empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={self.foodRate.bind(null, dish)}/>
                  <span id={dish.id} className="glyphicon glyphicon-remove-circle remove" onClick={self.handleRemove.bind(null, dish)}></span>
                </div>
              </div>
                );
            })
          });
        },
        error: function(err) {
          console.log(err)
        }
      })

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    })
  },
  handleRemove: function(dish) { 
    $('#' + dish.id).parent().parent().hide(400);
    this.ratings[dish.DishId] = -1;
  },
  foodRate: function(dish, value) {
    this.ratings[dish.DishId] = value;
  }, 
  handleSubmit: function() {
    var self = this;
    var query = {id: this.props.query.id};
    query.dishes = [];
    for (var prop in this.ratings) {
      query.dishes.push({id: prop, rating: this.ratings[prop]})
    }
    $.ajax({
      method: 'GET',
      url: '/rate',
      data: query,
      success: function(data) {
        self.componentDidMount();
      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  handleClick: function(link) {
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },
  render: function() {
      var self = this;
      var submit, directions;
      var added = this.props.query.added || '';
      if (added) {
        $('.message').show();
      }
      if (this.state.dishes.length) {
        directions = <p className="directions">Rate your recent dishes or delete</p>;
        submit = 
          <div className="center-block">
            <button className="center-block btn btn-warning" onClick={this.handleSubmit}>
              Submit Ratings
            </button>
          </div>;
      } else {
        submit = '';
      }
      return (
        <div className="container">
          <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
            <div className="form-group">
              <button type="button" className="btn btn-warning btn-lg btn-block" onClick={this.handleClick.bind(this, "parameters")}><span className="glyphicon glyphicon-search icon"></span>Search for Food</button>

              <button type="button" className="btn btn-warning btn-lg btn-block second" onClick={this.handleClick.bind(this, "entry")}><span className="glyphicon glyphicon-plus icon"></span>Add Food</button>
            </div>
            <div><p className="message">{added}</p></div>
            {directions}
            <div>
              {this.state.dishes}
            </div>
            {submit}
          </div>
        </div>
      );
    }
});

module.exports = Main;