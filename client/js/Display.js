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
  componentWillUnmount: function() {
    $(".filter").remove()
  },
  componentDidMount: function() {
    $(".header-main__inner").append('<div class="filter" style="text-align:center;font-size:24px;font-weight:400;left:40%;position:fixed;top:6px;z-index:10;color:#23B5AF">Filters :'+'  '+'</div>');
    console.log(this.props);
    if(this.props.query.vegetarian === 'true'){
      $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/vegetarian.png"></img>')
    }
    if(this.props.query.vegan === 'true'){
      $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/vegan.png"></img>')
    }
    if(this.props.query.lactosefree === 'true'){
      $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/lactosefree.png"></img>')
    }
    if(this.props.query.glutenfree === 'true'){
      $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/glutenfree.png"></img>')
    }
    if(this.props.query.vegetarian === 'false' 
       && this.props.query.vegan === 'false'
       && this.props.query.lactosefree === 'false'
       && this.props.query.glutenfree === 'false') {
      $(".filter").remove();
    }
    
    plateRotate();
    var self = this;
    $.ajax({
      url: '/dishes',
      method: 'GET',
      data: {
        zip: this.props.query.zip,
        price: this.props.query.price,
        vegan: this.props.query.vegan,
        vegetarian: this.props.query.vegetarian,
        glutenfree: this.props.query.glutenfree,
        lactosefree: this.props.query.lactosefree
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
            <button className="form-control btn btn-warning center-block" onClick={self.mapRoute}>Map</button>
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
    $('.center').slick({
      lazyLoad: 'progressive',
      slidesToShow: 4,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
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
      var el = <section id={item.id} className="slide">
        <p><strong>{item.name}</strong> <span className="green">{displayMoney(item.price_rating)}</span></p>
        <a href={'#/restaurant?resId=' + item.Restaurant.id}className="restaurant-name"><em>{item.Restaurant.name}</em></a>
        <img className="img-thumbnail picture" onClick={self.handleClick.bind(null, item)} data-lazy={item.img_url}/>
        <p>{item.num_ratings} Reviews</p>
        <Rating initialRate={parseInt(rating)} readonly={true} full="readonly glyphicon glyphicon-star star orange" empty="readonly glyphicon glyphicon-star-empty star"/>
      </section>;
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
    });
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
