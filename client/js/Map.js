var fb = require('./login');
var router = require('./App');

// var locations = this.props.query.locations
var locations = ['944 Market St, San Francisco, CA', '1400 Market St, San Francisco, CA', '844 Market St, San Francisco, CA'];


var Map = React.createClass({
getDefaultProps: function () {
        return {
            initialZoom: 12,
            mapCenterLat: 37.783,
            mapCenterLng: 122.416,
        };
    },
    componentDidMount: function (rootNode) {
        var mapOptions = {
            center: this.mapCenterLatLng(),
            zoom: this.props.initialZoom
        };
        var map = new google.maps.Map(this.getDOMNode(), mapOptions);
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
      console.log("this.props = ",this.props);
        var props = this.props;
        return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
    },

    render: function () {
        return (
          <div className='map-gic'></div>
        );
    }
});

module.exports = Map;