var router = require('./App');

var Map = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    //setting defaults for google maps
    return {
      initialZoom: 12,
      mapCenterLat: 37.783,
      mapCenterLng: 122.416,
      locations: []
    };
  },
  componentWillUnmount: function() {
    //removing title upon leaving page
    $(".maptitle").remove();
  },

  componentDidMount: function (rootNode) {
    //Adding title to page
    $(".header-main__inner").append('<center><div class="maptitle" style="width: 200px;margin-top:-42px;text-align:center;font-size:24px;top:5px;z-index:10;color:white">Map</div></center>');
    $(".header-main__user-name").hide();
    plateRotate();
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
       url: "/food/3dishes",
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
      zoom: this.state.initialZoom,
      styles: grayStyles
    };

    var map = new google.maps.Map(this.getDOMNode().children[0].children[1], mapOptions);

    var geocoder = new google.maps.Geocoder();
    //convert the address into a marker on the map
    var geocodeAddress = function (geocoder, resultsMap, address, name, img, dish) {
      geocoder.geocode({'address': address}, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          alert('Geocode was not successful for the following reason: ' + status);
          return;
        }
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon: '../assets/mapMarkers/restaurant.png'
        });
        // setting content for info window
        var contentString = "<a target='_blank' href='http://maps.google.com/?q=" + address + "'><div class='iw-title'  >"+name+"</div></a><br><div class='iw-link' target='_blank' href='http://maps.google.com/?q=" + address + "'>"+dish+"</div><br><image class='img-thumbnail iw-img' src='"+img+"' target='_blank' href='http://maps.google.com/?q=" + address + "'></image>";

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        //closes info window when another marker is clicked
        google.maps.event.addListener(marker, 'click', function () {                
          self.state.info_window.setContent(contentString);
          self.state.info_window.open(map, this);
        });

  // Event that closes the Info Window with a click on the map
          google.maps.event.addListener(map, 'click', function() {
            self.state.info_window.close();
          });
       });
    };
    //initializing map
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

  sendToFB: function() {
    var self = this;
    var foodInfo = this.state.locations; 
    var blobs = [];
    
    // Converts the base
    var dataURItoBlob = function (dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: 'image/jpeg' });
    };

    var postIt = function(blob, foodName) {
      var fd = new FormData();
      fd.append("access_token",localStorage.getItem('accessToken'));
      fd.append("source", blob );
      fd.append("message", foodName);
      
      $.ajax({
          url:"https://graph.facebook.com/" + self.props.query.id + "/photos?access_token=" + localStorage.getItem('accessToken'),
          type:"POST",
          data:fd,
          processData:false,
          contentType:false,
          cache:false,
          success:function(data){
              console.log("success " + data);
          },
          error:function(shr,status,data){
              console.log("error " + data + " Status " + shr.status);
          },
          complete:function(){
          console.log("Posted to facebook");
          }
      });
    }
    
    for (var j = 0; j < foodInfo.length; j++) {
      postIt(dataURItoBlob(foodInfo[j].img_url), foodInfo[j].name);
    }
  },

  render: function () {
      return (
        <div> 
          <div className="mapdiv">
            <div>
              <div className="mapgreet">
                <label>HERE ARE YOUR DESTINATIONS
                </label>
              </div>
            </div>
            <div className="map-google"></div>
            <div>
              <div className="form-group">
                <center><button type="button" className="btn btn-warning btn-lg btn-block hist-btn" onClick={this.sendToFB}>Send to FaceBook</button></center>
                <button type="button" className="btn btn-warning btn-lg btn-block mapbutton" onClick={this.handleClick.bind(this, "main")}>Try Again?
                </button>
              </div>
            </div>
          </div>   
        </div>
      );
  }
});

module.exports = Map;


//map styles
var grayStyles = [{
  "featureType": "landscape.natural",
  "elementType": "geometry.fill",
  "stylers": [
      {"visibility": "on"},
      {"color": "#e0efef"}
  ]},
  { "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {"visibility": "on"},
      {"hue": "#1900ff"},
      {"color": "#c0e8e8"}
  ]},
  { "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {"lightness": 100},
      {"visibility": "simplified"}
  ]},
  { "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {"visibility": "off"}
  ]},
  { "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {"visibility": "on"},
      {"lightness": 700}
  ]},
  { "featureType": "water",
    "elementType": "all",
    "stylers": [
      {"color": "#7dcdcd"}
  ]
}];