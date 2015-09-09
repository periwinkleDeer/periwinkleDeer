var router = require('./App');

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
    $(document).ready(function () {
        DoRotate(360);
        AnimateRotate(360);
    });

    function DoRotate(d) {
        $(".header-main__logo").css({
            transform: 'rotate(' + d + 'deg)'
        });
    }

    function AnimateRotate(d){
        var elem = $(".header-main__logo");

        $({deg: 0}).animate({deg: d}, {
            duration: 5000,
            step: function(now){
                elem.css({
                     transform: "rotate(" + now + "deg)"
                });
            }
        });
    }
    var self = this;
    var restaurants = this.props.query.dishes;
    self.setState({info_window: new google.maps.InfoWindow({
        content: 'loading'
    })});
    if (typeof(FB) !== 'undefined' && FB !== null) {
      FB.getLoginStatus(function(response){
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
           self.setState({locations: data}); 
           //set the 3 map markers here
           self.state.locations.forEach(function(loc){
             geocodeAddress(geocoder, map, loc.Restaurant.location, loc.Restaurant.name, loc.img_url, loc.name);
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
    var geocodeAddress = function (geocoder, resultsMap, address, name, img, dish) {
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
          var contentString = "<a target='_blank' href='http://maps.google.com/?q=" + address + "'><div class='iw-title'  >"+name+"</div></a><br><div class='iw-link' target='_blank' href='http://maps.google.com/?q=" + address + "'>"+dish+"</div><br><image class='img-thumbnail iw-img' src='"+img+"' target='_blank' href='http://maps.google.com/?q=" + address + "'></image>"
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          google.maps.event.addListener(marker, 'click', function () {                
            self.state.info_window.setContent(contentString);
            self.state.info_window.open(map, this);
          });

  // Event that closes the Info Window with a click on the map
          google.maps.event.addListener(map, 'click', function() {
            self.state.info_window.close();
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
    // this.context.router.transitionTo('/' + link);
    this.context.router.transitionTo('/' + link, null, {id: this.props.query.id});
  },
  render: function () {
      return (
        <div> 
          <div className="mapdiv">
            <div>
              <div className="mapgreet">
                <label>Go Out And Nibbler!
                </label>
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