var Parameters = React.createClass({
  handleClick: function() {
    console.log("Clicked");
    if (!navigator.geolocation){
      console.log("Geolocation is not supported by your browser</p>");
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;

      console.log('Latitude is ' + latitude + '° <br>Longitude is ' + longitude);

      var img = new Image();
      img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

      document.body.appendChild(img);
    };

    function error() {
      console.log("Unable to retrieve your location");
    };

    console.log('Locating');

    navigator.geolocation.getCurrentPosition(success, error);
  },
  render: function(){
    return (
      <button onClick={this.handleClick}>Click Me</button>
    )
  }
});

module.exports = Parameters;