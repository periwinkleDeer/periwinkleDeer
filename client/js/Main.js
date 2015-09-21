var router = require('./App');
var Rating = require('react-rating');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: 'Loading...'};
    //initializes state prior to ajax results
    return {dishes: 'Loading...'}
  },
  componentWillUnmount: function() {
    //removes heading upon leaving page
    $(".nibbler").remove();
    $(".welcome").remove();
  },
  componentWillMount: function() {
    localStorage.setItem('fb_id', this.props.query.id);
  },
  componentDidMount: function() {
    //adds heading text
    setTimeout(function() {
      $(".header-main__inner").append('<center><div class="welcome" style="width: 200px;margin-top:-42px;text-align:center;font-size:24px;top:5px;z-index:10;color:white">Welcome, '+localStorage.getItem('username')+'</div></center>');
    }, 500);
    $(".header-main__user-name").hide();
    plateRotate();
    this.ratings = {};
    var self = this;
    localStorage.setItem('fb_id', this.props.query.id);
    //gets all dishes unrated by user
    $.ajax({
        url: "/user/unrated",
        type: "GET",
        data: {id: self.props.query.id},
        success: function(data) {
          data.forEach(function(dish) {
            self.ratings[dish.DishId] = false;
          })
          self.setState({dishes: renderDishes(self, data)});
        },
        error: function(err) {
          console.log(err);
        }
      });

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    });
  },
  //when user clicks the remove
  handleRemove: function(dish) { 
    $('.display-error').hide();
    $('#' + dish.id).parent().parent().hide(400);
    this.ratings[dish.DishId] = -1;
  },
  //when user chooses a star rating
  foodRate: function(dish, value) {
    $('.display-error').hide();
    this.ratings[dish.DishId] = value;
  }, 
  handleSubmit: function() {
    var self = this;
    var query = {id: this.props.query.id};
    query.dishes = [];
    //creates obj for dishIds and ratings
    for (var prop in this.ratings) {
      if (!this.ratings[prop]) {
        $('.display-error').show();
        return;
      }
      query.dishes.push({id: prop, rating: this.ratings[prop]});
    }
    //submits current ratings to the database
    $.ajax({
      method: 'POST',
      url: '/user/ratings',
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
        //if redirected from entry page, shows result
        $('.message').show();
      }
      //if there are dishes to rate
      if (this.state.dishes.length) {
        directions = <p className="directions">Rate your recent dishes or delete</p>;
        submit = renderSubmit(this); 
      } else {
        //no dishes, button should not render
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
            <p className="display-error">Please Enter Ratings</p>
            {submit}
          </div>
        </div>
      );
    }
});

module.exports = Main;

//individual dish views for unrated dishes
var renderDishes = function(ctx, data) {
  return data.map(function(dish) {
    return (
      <div className="card">
        <div><strong>{dish.Dish.name}</strong></div>
        <p><em><small>{dish.Dish.category}</small></em></p>
        <center><img className="img-thumbnail" src={dish.Dish.img_url}/></center>
        <div className="stars">
          <Rating empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={ctx.foodRate.bind(ctx, dish)}/>
          <span id={dish.id} className="glyphicon glyphicon-remove-circle remove" onClick={ctx.handleRemove.bind(ctx, dish)}></span>
        </div>
      </div>
    );
  }) 
};

//submit text when there are dishes to rate
var renderSubmit = function(ctx) {
  return (
    <div className="center-block">
      <button className="center-block btn btn-warning" onClick={ctx.handleSubmit}>
        Submit Ratings
      </button>
    </div>
  );
}
