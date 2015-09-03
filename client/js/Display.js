var router = require('./App');
var Rating = require('react-rating');

var Display = React.createClass({
  contextTypes: {
     router: React.PropTypes.func
   },
  getInitialState: function() {
    return {dishes: "Loading...."};
  },
  componentDidMount: function() {
    var self = this;
    $.ajax({
      url: '/dishes',
      method: 'GET',
      data: {
        zip: this.props.query.zip,
        price: this.props.query.price
      },
      success: function(data) {
        var food = self.sortData(data);
        var dishes = 
          <div>
          <div className="slider-for"></div>
          <h4 className="category">Snacks</h4>
          <div className="center">
            {food.snackdivs}
          </div>
          <h4 className="category">Grub</h4>
          <div className="center">
            {food.grubdivs}
          </div>
          <h4 className="category">Dessert</h4>
          <div className="center">
            {food.dessertdivs}
          </div>
          <div className="col-xs-10 col-xs-offset-1">
            <button className="form-control btn btn-warning center-block" onClick={self.mapRoute}><strong>Map</strong></button>
          </div>
          </div>;
          self.setState({dishes: dishes});
          self.initializeSlick();
      },
      error: function(err) {
        console.log(err);
      }
    });
    this.choices = {};
  },
  initializeSlick: function () {
    console.log("initializing");
    $('.center').slick({
      centerPadding: '60px',
      arrows: true,
      slidesToShow: 4,
      slidesToScroll:2,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerPadding: '40px',
            slidesToShow: 2
          }
        }
      ]
    });
  },
  sortData: function(data) {
    var self = this;
    var food = {};
    food.snackdivs = [];
    food.grubdivs = [];
    food.dessertdivs = []
    var divs = data.forEach(function(item) {
      var rating = item.rating
      var el = <div id={item.id} className="slide" onClick={self.handleClick.bind(null, item)}>
        <p><strong>{item.name}</strong></p>
        <p className="restaurant-name"><em>{item.Restaurant.name}</em></p>
        <img src={item.img_url}/>
        <p>{item.num_ratings} Reviews</p>
        <Rating initialRate={rating} readonly="true" full="glyphicon glyphicon-star-empty star orange" empty="glyphicon glyphicon-star-empty star"/>
      </div>;
      if (item.category === 'Snack') {
        food.snackdivs.push(el);
      } else if (item.category === 'Grub') {
        food.grubdivs.push(el);
      } else if (item.category == 'Dessert') {
        food.dessertdivs.push(el);
      }
    });
    return food;
  },
  handleClick: function(value){ 
    if (this.choices.hasOwnProperty(value.category)) {
      if (value.id === this.choices[value.category].id) {
        $('#' + value.id).removeClass('highlighted');
        delete this.choices[value.category];
        return;
      } else {
        var previous = this.choices[value.category];
        $('#'+previous.id).removeClass('highlighted');
        $('#'+value.id).addClass('highlighted');
        this.choices[value.category]= value;
        return;
      }
    } else {
      $('#'+value.id).addClass('highlighted');
        this.choices[value.category]= value;
    }
  },
  mapRoute:function(){
    var self = this;
    var destinations = [];
    var dishIds = [];
    for (var category in this.choices) {
      dishIds.push(this.choices[category].id)
    }
    console.log(dishIds);
    $.ajax({
      method: 'GET',
      url: '/selecting',
      data: {id: this.props.query.id, dishes: dishIds},
      success: function(data) {
        self.context.router.transitionTo('/map', null, {
          id: self.props.query.id,
          dishes: dishIds
        });
      }
    })
  },
  render: function () {

   
    return (
      <div className="container display">
        {this.state.dishes}
      </div>
    );
  }
});

module.exports = Display;
