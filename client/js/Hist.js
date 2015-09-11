var router = require('./App');

var Hist = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      initialZoom: 11,
      mapCenterLat: 37.783,
      mapCenterLng: 122.416,
      locations: []
    };
  },

  componentDidMount: function (rootNode) {
    plateRotate();
    var self = this;
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
    // using user id ask for 20 most recent dishes/restaurants
    $.ajax({
       url: "/history",
       type: "GET",
       data: {id: this.props.query.id},
       success: function(data) {
           console.log("success!!! This is the data ==== ", data);
           self.setState({locations: data}); 
           //set the 3 map markers here
           self.state.locations.forEach(function(loc) {
             dishes = [];
             loc.Dishes.forEach(function(dish) {
              dishes.push(dish);
             })
             geocodeAddress(geocoder, map, loc.location, loc.name, dishes);
           });   
       }.bind(this),
       error: function(xhr, status, err) {
           console.log(xhr, status, err);
       }.bind(this)
    });
    //load the google map
    localStorage.setItem('currentRoute', '/map');
    var grayStyles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#193341"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c5a71"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#29768a"
            },
            {
                "lightness": -37
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#406d80"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#406d80"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#3e606f"
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.84
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "weight": 0.6
            },
            {
                "color": "#1a3541"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c5a71"
            }
        ]
    }];
    var mapOptions = {
        center: this.mapCenterLatLng(),
        zoom: this.state.initialZoom,
        styles: grayStyles
    };

    var map = new google.maps.Map(this.getDOMNode().children[0].children[1], mapOptions);

    var geocoder = new google.maps.Geocoder();
    //convert the address into a marker on the map
    var geocodeAddress = function (geocoder, resultsMap, address, name, dishes) {
      // console.log("geocoding address")
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location,
            icon: '../assets/mapMarkers/restaurant-orange.png'
          });
          var img = "";
          dishes.forEach(function(dish) {
            img = img + "<div class='iw-name-hist'>"+dish.name+"</div><image class='iw-img img-thumbnail' src='"+dish.img_url+"'></image>"
          })
          var contentString = "<a target='_blank' href='http://maps.google.com/?q=" + address + "'><div class='iw-title'>"+name+"</div></a><br>"+img+""
          var infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          google.maps.event.addListener(marker, 'click', function () {                
            self.state.info_window.setContent(contentString);
            self.state.info_window.open(map, this);
          });
  // Event that closes the Info Window with a click on the map
          google.maps.event.addListener(map, 'click', function() {
            self.state.info_window.close();
          });
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
    // console.log("btn click", this);
    // this.context.router.transitionTo('/' + link);
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },
  render: function () {
      return (
        <div> 
          <div className="mapdiv">
            <div>
              <div className="mapgreet">
                <label>Your History Map
                </label>
              </div>
            </div>
            <div className="map-google"></div>
            <div>
              <div className="form-group">
                <button type="button" className="btn btn-warning btn-lg btn-block mapbutton" onClick={this.handleClick.bind(this, "profile")}>BACK</button>
              </div>
            </div>
          </div>   
        </div>
      );
  }
});

module.exports = Hist;