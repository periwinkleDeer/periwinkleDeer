var router = require('./App');

// var locations = this.props.query.locations

var Map = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      initialZoom: 12,
      mapCenterLat: 37.783,
      mapCenterLng: 122.416,
      locations: []
    };
  },

  componentDidMount: function (rootNode) {
    var self = this;
    console.log(this.props.query);
    var restaurants = this.props.query.dishes;
    console.log(restaurants);
    self.setState({info_window: new google.maps.InfoWindow({
        content: 'loading'
    })});
    if (typeof(FB) !== 'undefined' && FB !== null) {
      FB.getLoginStatus(function(response){
        // console.log("map.js", response)
        if (response.status !== 'connected') {
          self.context.router.transitionTo('/login');
        }
      });
    }
    // using dishIds in restaurants, ask the DB for these dishes
    $.ajax({
       url: "/get3dishes",
       type: "GET",
       data: {restaurants: restaurants},
       success: function(data) {
           console.log("success!!! This is the data ==== ", data);
           self.setState({locations: data}); 
           //set the 3 map markers here
           self.state.locations.forEach(function(loc){
             console.log("loc.Restaurant ==== ", loc.Restaurant);
             geocodeAddress(geocoder, map, loc.Restaurant.location, loc.Restaurant.name);
           });   
       }.bind(this),
       error: function(xhr, status, err) {
           console.log(xhr, status, err);
       }.bind(this)
    });
    //load the google map
    localStorage.setItem('currentRoute', '/map');
    var mapOptions = {
        center: this.mapCenterLatLng(),
        zoom: this.state.initialZoom
    };

    var map = new google.maps.Map(this.getDOMNode().children[0].children[1], mapOptions);

    var geocoder = new google.maps.Geocoder();
    //convert the address into a marker on the map
    var geocodeAddress = function (geocoder, resultsMap, address, name) {
      // console.log("geocoding address")
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
          var contentString = "<a target='_blank' href='http://maps.google.com/?q=" + address + "'>"+name+"</a><br><a target='_blank' href='http://maps.google.com/?q=" + address + "'>"+'(click to go to google maps)'+"</a>"
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          google.maps.event.addListener(marker, 'click', function () {                
            self.state.info_window.setContent(contentString);
            self.state.info_window.open(map, this);
          });
          // marker.addListener('click', function() {
          //     infowindow.open(map, marker);
          //   });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
    this.setState({map: map});

  },
  mapCenterLatLng: function () {
      var props = this.state;
      return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
  },
  handleClick: function(link) {
    console.log("btn click", this);
    // this.context.router.transitionTo('/' + link);
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },
  render: function () {
      return (
        <div> 
          <div className="mapdiv">
            <div>
              <div className="form-group">
                <div className="btn-lg btn-block mapgreeting">Great choices! Here they are on a map!
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