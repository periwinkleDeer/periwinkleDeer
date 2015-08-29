var Parameters = React.createClass({
  getInitialState: function() {
    return {geolocation: null};
  },
  handleClick: function() {
    var that = this;
    var distance = document.getElementById('distance').value;
    console.log(distance);
    console.log("Clicked");
    if (!navigator.geolocation){
      console.log("Geolocation is not supported by your browser</p>");
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      $.ajax({
        url: '/dishes',
        method: 'GET',
        data: {
          geolocation: latitude + ',' + longitude,
          distance: distance
        },
        success: function(data) {
          console.log('yay!');
        },
        error: function(err) {
          console.log(err);
        }
      });
      
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    console.log('Locating');

    navigator.geolocation.getCurrentPosition(success, error);
  },

  render: function(){
    return (
      <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
        <div className="form-group">
        <label>How far do you want to travel?</label>
          <select id="distance" className="form-control">
            <option value="805">0.5 mi</option>
            <option value="1600">1 mi</option>
            <option value="3200">2 mi</option>
          </select>
        </div>
        <button className="btn btn-primary form-control" onClick={this.handleClick}>Click Me</button>
      </div>
    );
  }
});

module.exports = Parameters;