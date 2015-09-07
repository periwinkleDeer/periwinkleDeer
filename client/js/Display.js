var router = require('./App');
var Rating = require('react-rating');

var emptyObject = function(object){
  for (var prop in object) {
    if (object[prop]) {
      return false;
    }
  }
  return true;
};  

var displayMoney = function(num) {
  var string = '';
  for (var i = 0; i < parseInt(num); i++) {
    string += '$';
  }
  return string;
}

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
        var rows = [];
        for (var category in food) {
          if (!food[category].length) {
            rows.push(<div><h4 className="category">{category}</h4>
              <p className="display-missing">Sorry, No dishes found...</p></div>);
          } else {
            rows.push(<div><h4 className="category">{category}</h4>
              <div className="center">
                {food[category]}
              </div></div>);
          }
        };
        var dishes = 
          <div>
            {rows}
          <p className="display-error">No Choices Selected</p>
          <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
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
    food.Snacks = [];
    food.Grub = [];
    food.Desserts = []
    var divs = data.forEach(function(item) {
      var rating = item.rating
      var el = <div id={item.id} className="slide">
        <p><strong>{item.name}</strong> <span className="green">{displayMoney(item.price_rating)}</span></p>
        <a href={'#/restaurant?resId=' + item.Restaurant.id}className="restaurant-name"><em>{item.Restaurant.name}</em></a>
        <img className="img-thumbnail picture" onClick={self.handleClick.bind(null, item)} src={item.img_url}/>
        <p>{item.num_ratings} Reviews</p>
        <Rating initialRate={rating} readonly="true" full="glyphicon glyphicon-star star orange" empty="glyphicon glyphicon-star-empty star"/>
      </div>;
      if (item.category === 'Snack') {
        food.Snacks.push(el);
      } else if (item.category === 'Grub') {
        food.Grub.push(el);
      } else if (item.category == 'Dessert') {
        food.Desserts.push(el);
      }
    });
    return food;
  },
  handleClick: function(value){
    $('.display-error').hide();
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
    if (emptyObject(this.choices)) {
      $('.display-error').show();
      $('html, body').animate({scrollTop: $(document).height()}, 'slow');
      return;
    }
    for (var category in this.choices) {
      dishIds.push(this.choices[category].id)
    }
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
