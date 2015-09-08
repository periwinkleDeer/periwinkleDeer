var router = require('./App');

// var locations = this.props.query.locations

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

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
             console.log("loc.img_url ==== ", loc.img_url);
             geocodeAddress(geocoder, map, loc.Restaurant.location, loc.Restaurant.name, loc.img_url);
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
    var geocodeAddress = function (geocoder, resultsMap, address, name, img) {
      // console.log("geocoding address")
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
          var contentString = "<div class='iw-title' target='_blank' href='http://maps.google.com/?q=" + address + "'>"+name+"</div><br><div class='iw-link' target='_blank' href='http://maps.google.com/?q=" + address + "'>"+'(click to go to google maps)'+"</div><br><image class='iw-img' src='"+img+"' target='_blank' href='http://maps.google.com/?q=" + address + "'></image>"
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