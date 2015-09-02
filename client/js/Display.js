var router = require('./App');
// var Slider = require('react-slick');

var Display = React.createClass({
  contextTypes: {
     router: React.PropTypes.func
   },
  getInitialState: function() {
    return {nums: [
      {category: 'snacks', id: 1, name: 1},
      {category: 'snacks', id: 2, name: 2},
      {category: 'snacks', id: 3, name: 3},
      {category: 'snacks', id: 4, name: 4},
      {category: 'snacks', id: 5, name: 5},
      {category: 'snacks', id: 6, name: 6},
      {category: 'snacks', id: 7, name: 7},
      {category: 'snacks', id: 8, name: 8},
      {category: 'snacks', id: 9, name: 9},
      {category: 'grub', id: 11, name: 11},
      {category: 'grub', id: 12, name: 12},
      {category: 'grub', id: 13, name: 13},
      {category: 'grub', id: 14, name: 14},
      {category: 'grub', id: 15, name: 15},
      {category: 'grub', id: 16, name: 16},
      {category: 'grub', id: 17, name: 17},
      {category: 'grub', id: 18, name: 18},
      {category: 'grub', id: 19, name: 19},
      {category: 'dessert', id: 21, name: 21},
      {category: 'dessert', id: 22, name: 22},
      {category: 'dessert', id: 23, name: 23},
      {category: 'dessert', id: 24, name: 24},
      {category: 'dessert', id: 25, name: 25},
      {category: 'dessert', id: 26, name: 26},
      {category: 'dessert', id: 27, name: 27},
      {category: 'dessert', id: 28, name: 28},
      {category: 'dessert', id: 29, name: 29}
    ]}
    // return this.props.query.dishes;
  },
  componentDidMount: function() {
    this.choices = {};
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
      $('#'+previous.name).removeClass('highlighted');
    }
    $('#'+value.name).addClass('highlighted');
    this.choices[value.category]= value;
  },
  mapRoute:function(){
    var self = this;
    var destinations = [];
    for (var category in this.choices) {
      destinations.push(this.choices[category]);
    }
    console.log(destinations);
    $.ajax({
      method: 'GET',
      url: '/selecting',
      data: {id: FB.getUserID(), dishes: destinations},
      success: function(data) {
        self.context.router.transitionTo('/map', null, {destinations: destinations})
      }
    })
  },
  render: function () {
    var self= this;
    var snackdivs = [];
    var grubdivs = [];
    var dessertdivs = []
    var divs = this.state.nums.forEach(function(num) {
      var el = <div id={num.name} onClick={self.handleClick.bind(null, num)}>{num.name}</div>;
      if (num.category === 'snacks') {
        snackdivs.push(el);
      } else if (num.category === 'grub') {
        grubdivs.push(el);
      } else {
        dessertdivs.push(el);
      }
    });
   
    return (
      <div className="container">
        <h3>Snacks</h3>
        <div className="center">
          {snackdivs}
        </div>
        <h3>Grub</h3>
        <div className="center">
          {grubdivs}
        </div>
        <h3>Dessert</h3>
        <div className="center">
          {dessertdivs}
        </div>
        <div className="center-block">
          <button className="btn btn-warning center-block" onClick={self.mapRoute}>Map</button>
        </div>
      </div>
    );
  }
});

module.exports = Display;
