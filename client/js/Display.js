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
        console.log(data)
        var snackdivs = [];
        var grubdivs = [];
        var dessertdivs = []
        var divs = data.forEach(function(item) {
          var rating = item.rating
          var el = <div id={item.id} onClick={self.handleClick.bind(null, item)}>
            <p><strong>{item.name}</strong></p>
            <img src={item.img_url}/>
            <p>{item.num_ratings} Reviews</p>
            <Rating initialRate={rating} readonly="true" full="glyphicon glyphicon-star-empty star orange" empty="glyphicon glyphicon-star-empty star"/>
          </div>;
          if (item.category === 'Snack') {
            snackdivs.push(el);
          } else if (item.category === 'Grub') {
            grubdivs.push(el);
          } else {
            dessertdivs.push(el);
          }
        });
        var dishes = 
          <div>
          <h4>Snacks</h4>
          <div className="center">
            {snackdivs}
          </div>
          <h4>Grub</h4>
          <div className="center">
            {grubdivs}
          </div>
          <h4>Dessert</h4>
          <div className="center">
            {dessertdivs}
          </div>
          <div className="center-block">
            <button className="btn btn-warning center-block" onClick={self.mapRoute}>Map</button>
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
      infinite: true,
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
  handleClick: function(value){
    if (this.choices.hasOwnProperty(value.category)) {
      var previous = this.choices[value.category];
      $('#'+previous.id).removeClass('highlighted');
    }
    $('#'+value.id).addClass('highlighted');
    this.choices[value.category]= value;
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
