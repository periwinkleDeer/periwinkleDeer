var router = require('./App');
var Card = require('./Card').displayCard;

var Display = React.createClass({
  contextTypes: {
     router: React.PropTypes.func
   },
  getInitialState: function() {
    //sets initial state prior to ajax results
    return {dishes: "Loading...."};
  },
  componentWillUnmount: function() {
    $(".filter").remove();
  },
  componentDidMount: function() {
    renderFilters(this.props.query);
    plateRotate();
    var self = this;

    //gets dishes that satisfy the query
    $.ajax({
      url: '/food/dishes',
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
        //sorts data by category
        var food = sortData(self, data);
        //formats page with data
        var dishes = renderPage(self, food);
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
    //initializes the jquery slick plugin
    $('.center').slick({
      lazyLoad: 'progressive',
      infinite: false,
      slidesToShow: 4,
      swipeToSlide: true,
      responsive: [
        { breakpoint: 768,
          settings: { slidesToShow: 3 }
        },
        { breakpoint: 480,
          settings: { slidesToShow: 2 }
        }
      ]
    });
  },
  handleClick: function(value){
    //handles the highlighting of dishes on click 
    //creates selection object with categories
    console.log(value)
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
    //retrieving dishes from selection object
    for (var category in this.choices) {
      dishIds.push(this.choices[category].id);
    }
    //submits selection to database, reroutes to map page
    $.ajax({
      method: 'POST',
      url: '/user/selections',
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

//checks if any dishes are selected
var emptyObject = function(object){
  for (var prop in object) {
    if (object[prop]) {
      return false;
    }
  }
  return true;
};  

//shows filters selected
var renderFilters = function(query) {
  $(".header-main__inner").append('<center><div class="filter" style="margin-top:-38px;z-index:10"></div></center>');
  if(query.vegetarian === 'true'){
    $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/vegetarian.png"></img>');
  }
  if(query.vegan === 'true'){
    $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/vegan.png"></img>');
  }
  if(query.lactosefree === 'true'){
    $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/lactosefree.png"></img>');
  }
  if(query.glutenfree === 'true'){
    $(".filter").append('<img class="allergy_sm" src="../assets/allergyIcons/glutenfree.png"></img>');
  }
  if(query.vegetarian === 'false' 
     && query.vegan === 'false'
     && query.lactosefree === 'false'
     && query.glutenfree === 'false') {
    $(".filter").remove();
    $(".header-main__user-name").hide();
  }
};

//sorting by category
var sortData = function(ctx, data) {
  var food = {};
  food.Snacks = [];
  food.Grub = [];
  food.Desserts = []
  var divs = data.forEach(function(item) {
    var rating = item.rating
    var el = 
    <Card item={item} onClick={ctx.handleClick.bind(ctx, item)}/>;
    if (item.category === 'Snack') {
      food.Snacks.push(el);
    } else if (item.category === 'Grub') {
      food.Grub.push(el);
    } else if (item.category == 'Dessert') {
      food.Desserts.push(el);
    }
  });
  return food;
};

//formating data
var renderPage = function(ctx, food) {
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
  }
  var dishes = 
    <div>
      {rows}
    <p className="display-error">No Choices Selected</p>
    <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
      <button className="form-control btn btn-warning center-block" onClick={ctx.mapRoute}>Map</button>
    </div>
    </div>;

  return dishes;
}