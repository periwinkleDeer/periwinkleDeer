var router = require('./App');
var StarRating = require('react-star-rating');
var Parameters = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {geolocation: null};
  },
  handleClick: function() {
    var self = this;
    $.ajax({
      url: '/dishes',
      method: 'GET',
      data: {
        zip: document.getElementById('neighborhood').value,
        price: document.getElementById('price-query').value
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

  render: function(){
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <div className="form-group">
            <label>Where do you want to eat today?</label>
            <select id="neighborhood" className="form-control">
              <option value="94102">Hayes Valley | Tenderloin | North of Market</option>
              <option value="94103">Soma</option>
              <option value="94107">Potrero Hill</option>
              <option value="94108">Chinatown</option>
              <option value="94109">Polk | Russian Hill | Nob Hill</option>
              <option value="94110">Inner Mission | Bernal Heights</option>
              <option value="94112">Ingelside-Excelsior | Crocker-Amazon</option>
              <option value="94114">Castro | Noe Valley</option>
              <option value="94115">Western Addition | Japantown</option>
              <option value="94116">Parkside/Forest Hill</option>
              <option value="94117">Haight-Ashbury</option>
              <option value="94118">Inner Richmond</option>
              <option value="94121">Outer Richmond</option>
              <option value="94122">Sunset</option>
              <option value="94123">Marina</option>
              <option value="94124">Bayview-Hunters Point</option>
              <option value="94127">St. Francis Wood/Miraloma/West Portal</option>
              <option value="94131">Twin Peaks-Glen Park</option>
              <option value="94132">Lake Merced</option>
              <option value="94133">North Beach | Chinatown</option>
              <option value="94134">Visitacion Valley | Sunnydale</option>
            </select>
            <div className="form-group">
              <label>Price Range (each item)?</label>
              <select id="price-query" className="form-control">
                <option value="1"> under $10</option>
                <option value="2"> $10-$20</option>
                <option value="3"> $20-$30</option>
                <option value="4"> $30-$40</option>
              </select>
            </div>
          </div>
          <button className="btn btn-warning form-control" onClick={this.handleClick}>Click Me</button>
        </div>
      </div>
    );
  }
});

module.exports = Parameters;