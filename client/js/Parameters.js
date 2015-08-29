var Parameters = React.createClass({
  getInitialState: function() {
    return {geolocation: null};
  },
  handleClick: function() {
    var that = this;
    console.log("Clicked");
    if (!navigator.geolocation){
      console.log("Geolocation is not supported by your browser</p>");
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;

      that.setState({geolocation: latitude+','+longitude});
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    console.log('Locating');

    navigator.geolocation.getCurrentPosition(success, error);
  },

  render: function(){
    return (
      <div>HELLLOOOOO</div>
      
      <select value="805">
        <option value="805">0.5 mi</option>
        <option value="1600">1 mi</option>
        <option value="3200">2 mi</option>
      </select>
      <button onClick={this.handleClick}>Click Me</button>
    )
  }
});

module.exports = Parameters;