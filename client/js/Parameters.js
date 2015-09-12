var router = require('./App');
var Rating = require('react-rating');
var DietQuery = require('./DietQuery');

var Parameters = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    $(".header-main__user-name").show();
    plateRotate();
    localStorage.setItem('currentRoute', '/parameters');
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    });
    this.vegan = false;
    this.vegetarian = false;
    this.lactosefree = false;
    this.glutenfree = false;
  },

  getInitialState: function() {
    return {neighborhoods: neighborhoods};
  },

  handleClick: function() {
    var self = this;
    this.context.router.transitionTo('/display', null, {
      id: this.props.query.id,
      zip: document.getElementById('neighborhood').value,
      price: this.value,
      vegan: this.vegan,
      vegetarian: this.vegetarian,
      glutenfree: this.glutenfree,
      lactosefree: this.lactosefree
    });
  },

  rate: function(value) {
    this.value = value;
    var values = {
      1: "under $10",
      2: "under $20",
      3: "under $30",
      4: "over $30"
    }
    $('.popup').text(values[value]);
  },

  selectDiet: function(value) {
    $('#' + value).toggleClass('diet-filter');
    this[value] = !this[value];
  },

  render: function(){
    var neighborhoods = this.state.neighborhoods.map(function(neighborhood) {
        var zip = Object.keys(neighborhood)[0];               
        return <option key={zip} value={zip}>{neighborhood}</option>;
      }
    );
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div className="form-group">
            <label>Where do you want to eat today?</label>
            <select id="neighborhood" className="form-control">
              {neighborhoods}
            </select>
            <DietQuery selectDiet={this.selectDiet} ctx={this}/>
            <div className="form-group spacing">
              <label>Price Range (each item)?</label>
              <br/>
              <Rating start={0} stop={4} step={1} empty="glyphicon glyphicon-usd usd" full="glyphicon glyphicon-usd green usd" onChange={this.rate}/><span className="popup"></span>
            </div>
          </div>
          <button className="btn btn-warning form-control" onClick={this.handleClick}><span className="glyphicon glyphicon-search icon"></span>Search</button>
        </div>
      </div>
    );
  }
});

module.exports = Parameters;

var neighborhoods = [
      {"94102": "Hayes Valley | Tenderloin | North of Market"},
      {"94103": "Soma"},
      {"94107": "Potrero Hill"},
      {"94108": "Chinatown"},
      {"94109": "Polk | Russian Hill | Nob Hill"},
      {"94110": "Inner Mission | Bernal Heights"},
      {"94111": "Embarcadero"},
      {"94112": "Ingelside-Excelsior | Crocker-Amazon"},
      {"94114": "Castro | Noe Valley"},
      {"94115": "Western Addition | Japantown"},
      {"94116": "Parkside/Forest Hill"},
      {"94117": "Haight-Ashbury"},
      {"94118": "Inner Richmond"},
      {"94121": "Outer Richmond"},
      {"94122": "Sunset"},
      {"94123": "Marina"},
      {"94124": "Bayview-Hunters Point"},
      {"94127": "St. Francis Wood/Miraloma/West Portal"},
      {"94131": "Twin Peaks-Glen Park"},
      {"94132": "Lake Merced"},
      {"94133": "North Beach | Chinatown"},
      {"94134": "Visitacion Valley | Sunnydale"}
    ];