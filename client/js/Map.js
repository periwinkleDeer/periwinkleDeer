var fb = require('./login');
var router = require('./App');

// var locations = this.props.query.locations
var restaurants = [{dishId: 1}, {dishId: 2}, {dishId: 3}];
var locations = [];


var Map = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      initialZoom: 12,
      mapCenterLat: 37.783,
      mapCenterLng: 122.416,
    };
  },

  componentDidMount: function (rootNode) {
<<<<<<< HEAD
    var self = this;
    if (typeof(FB) !== 'undefined' && FB !== null) {
      FB.getLoginStatus(function(response){
        console.log("map.js", response)
        if (response.status !== 'connected') {
          self.context.router.transitionTo('/login');
        }
      });
    }
    
=======
    // FB.getLoginStatus(function(response){
    //   if (response.status !== 'connected') {
    //     self.context.router.transitionTo('/login');
    //   }
    // });
    //using dishIds in restaurants ask the DB for these dishes
    $.ajax({
       url: "/get3dishes",
       type: "GET",
       data: {restaurants: restaurants},
       success: function(data) {
           console.log("success!!! This is the data ==== ", data);
       }.bind(this),
       error: function(xhr, status, err) {
           console.log(xhr, status, err);
       }.bind(this)
    });
    //load the google map
>>>>>>> create get3Dishes
    localStorage.setItem('currentRoute', '/map');
    var mapOptions = {
        center: this.mapCenterLatLng(),
        zoom: this.state.initialZoom
    };

    var map = new google.maps.Map(this.getDOMNode().children[0].children[1], mapOptions);

    var geocoder = new google.maps.Geocoder();
    //convert the address into a marker on the map
    var geocodeAddress = function (geocoder, resultsMap, address) {
      console.log("geocoding address")
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
          var contentString = "<a href='http://maps.google.com/?q=" + address + "'>"+address+"</a>"
          var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
          marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
    //set the 3 map markers here
    locations.forEach(function(loc){
      geocodeAddress(geocoder, map, loc);
    });   
  this.setState({map: map});
  },
  mapCenterLatLng: function () {
    console.log("this.state = ",this.state);
      var props = this.state;
      return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
  },
  handleClick: function(link) {
    console.log("btn click", this);
    this.context.router.transitionTo('/' + link);
  },
  render: function () {
    console.log("rendering")
      return (
        <div> 
          <div className="mapdiv">
            <div>
              <div className="form-group">
                <div className="btn-lg btn-block mapgreeting">Great Choices, Here They Are On A Map!
                </div>
              </div>
            </div>
            <div className="map-google"></div>
            <div>
              <div className="form-group">
                <button type="button" className="btn btn-warning btn-lg btn-block mapbutton" onClick={this.handleClick.bind(this, "main")}>Try Again?</button>
              </div>
            </div>
          </div>   
        </div>
      );
  }
});

module.exports = Map;