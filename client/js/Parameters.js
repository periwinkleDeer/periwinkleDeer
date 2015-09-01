var router = require('./App');
var Rating = require('react-rating');

var Parameters = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    localStorage.setItem('currentRoute', '/parameters');
    var self = this;
    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    })
  },

  getInitialState: function() {
    console.log("arawr")
    return {neighborhoods: [
      {"94102": "Hayes Valley | Tenderloin | North of Market"},
      {"94103": "Soma"},
      {"94107": "Potrero Hill"},
      {"94108": "Chinatown"},
      {"94109": "Polk | Russian Hill | Nob Hill"},
      {"94110": "Inner Mission | Bernal Heights"},
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
    ]};
  },

  handleClick: function() {
    var self = this;
    $.ajax({
      url: '/dishes',
      method: 'GET',
      data: {
        zip: document.getElementById('neighborhood').value,
        price: self.value
      },
      success: function(data) {
        console.log(data);
        console.log('yay!');
        self.context.router.transitionTo(/*MAIN DISPLAY PAGE*/);
      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  rate: function(value) {
    this.value = value;
    var values = {
      1: "under $10",
      2: "$10 - $20",
      3: "$20 - $30",
      4: "$30 - $40"
    }
    $('.popup').text(values[value]);
  },

  render: function(){
    var neighborhoods = this.state.neighborhoods.map(function(neighborhood, zip) {
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
            <div className="form-group spacing">
              <label>Price Range (each item)?</label>
              <br/>
              <Rating start={0} stop={4} step={1} empty="glyphicon glyphicon-usd usd" full="glyphicon glyphicon-usd green usd" onChange={this.rate}/><span className="popup"></span>
            </div>
          </div>
          <button className="btn btn-warning form-control" onClick={this.handleClick}>Click Me</button>
        </div>
      </div>
    );
  }
});

module.exports = Parameters;