var Rating = require('react-rating');
var router = require('./App'); 
var DietQuery = require('./DietQuery'); 

var Entry = React.createClass({
  contextTypes: {
   router: React.PropTypes.func
  },

  getInitialState: function(){
     return {
      error: '',
    };
   },

  componentDidMount: function(){
    $(".header-main__user-name").show();
    plateRotate();
    localStorage.setItem('currentRoute', '/entry');
    var self = this;
    var input = document.getElementById('restaurant');
    var options = {
      types: ['establishment']
    };
    this.vegetarian = 'false';
    this.vegan = 'false';
    this.lactosefree = 'false';
    this.glutenfree = 'false';

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function(){
      var place = autocomplete.getPlace();
      self.setState({
       restaurant: place
      });
    });

    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    });
  },

  handleSubmit: function(link){
    var self = this;
    self.setState({error: ''}); 
    var zip = zipCheck(this.state.restaurant.address_components);
    var rating = this.state.restaurant.rating || '!!';
    var phone = this.state.restaurant.formatted_phone_number || '!!';

    var store = {
       id         : this.props.query.id,
       restaurant : this.state.restaurant.name,
       address    : this.state.restaurant.formatted_address,
       zip        : zip,
       phone      : phone,
       resRating  : rating,
       dishName   : document.getElementById('dish').value,
       dishRating : this.foodRate,
       dishPrice  : this.priceRate,
       imgUrl     : this.state.dataUrl,
       category   : document.getElementById('category').value,
       vegetarian : this.vegetarian,
       vegan      : this.vegan,
       lactosefree: this.lactosefree,
       glutenfree : this.glutenfree
    };
    console.log(store);
    if(!checkObj(store)){
      self.setState({error: "Fill Out Everything Yo!"});
      $('.display-error').show();
      return;
    }
    
    $.ajax({
       url: "/food/newDish",
       type: "POST",
       data: store,
       success: function(data) {
           self.context.router.transitionTo('/' + link, null, {id: self.props.query.id, added: "Food Added"});
       }.bind(this),
       error: function(xhr, status, err) {
           // console.log(xhr, status, err);
           self.context.router.transitionTo('/' + link, null, {id: self.props.query.id, added: "That Food Item Already Exists"});
       }.bind(this)
    });
  },

  change: function(e){
      e.preventDefault();
     var files = e.target.files;
     var self = this;
     var maxWidth = 250;
     var maxHeight = 250;
     resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
         self.setState({ dataUrl: resizedDataUrl });
     });
  },

  ratePrice: function(value){
    this.priceRate = value;
    var values = {
       1: "under $10",
       2: "under $20",
       3: "under $30",
       4: "over $30"
    };
    $('.popup').text(values[value]);
  },

  rateFood: function(value){
    this.foodRate = value;
  },

  selectDiet: function(value) {
    $('#' + value).toggleClass('diet-filter');
    if(this[value] === 'false'){
      this[value] = 'true';
      console.log("setting ", value, "to", this[value]);
    }else{
      this[value] = 'false';
    }
  },

  render: function(){
    this.foodRate = this.foodRate || 0;
    this.priceRate = this.priceRate || 0;
     var image;
     var dataUrl = this.state.dataUrl;
     if(dataUrl){
       image = <img src={dataUrl} className="img-thumbnail"/>
     }

     return (
      <div className="container display">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          <Restaurant />
          <Nibble selectDiet={this.selectDiet} ctx={this} />

           <div className="form-group">
               <div className="btn btn-warning upload form-control" onClick={uploadImage}><span className="glyphicon glyphicon-camera camera icon"></span>Add Image</div>
               <input className="hidden" ref="upload" type="file" accept="image/*" onSubmit={this.handleSubmit} onChange={ this.change }/>
               <p className="help-block">{ image }</p>
           </div>           

           <Category />

           <div className="form-group">
            <label>Price Rating</label>
            <div></div>
               <Rating initialRate={this.priceRate} empty="glyphicon glyphicon-usd usd" full="glyphicon glyphicon-usd green usd" start={0} stop={4} step={1} onChange={this.ratePrice}/>
               <span className="popup"></span>
           </div>

           <div className="form-group">
            <label>Rate Dish</label>
            <div></div>
               <Rating initialRate={this.foodRate} empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={this.rateFood}/>
           </div>

             <button className="btn btn-warning form-control" onClick={this.handleSubmit.bind(this, "main")}><span className="glyphicon glyphicon-plus icon"></span>Add Food</button>
             <p className="display-error">{this.state.error}</p>

         </div>
      </div>
     )
  }
});

var Restaurant = React.createClass({
  render: function(){
    return(
      <div>
         <div className="form-group">
          <label>Restaurant</label>
           <input type="text" className="form-control" id="restaurant" placeholder="Where did you eat?"/>
        </div>
      </div>
    )
  }
});

var Nibble = React.createClass({
  render: function(){
    return (
      <div>
        <div className="form-group">
         <label>Nibble</label>
          <input type="text" className="form-control" id="dish" placeholder="What did you eat?"/>
          <DietQuery selectDiet={this.props.selectDiet} ctx={this.props.ctx} />
        </div>
      </div>
    )
  }
});

var Category = React.createClass({
  render: function(){
    return (
      <div>
        <div className="form-group">
          <label>Category</label>
          <select id="category" className="form-control">
            <option>Snack</option>
            <option>Grub</option>
            <option>Dessert</option>
          </select>
        </div>
      </div>
    )
  }
});

function checkObj(object){
  for(var key in object){
    if(!object[key]){
      return false;
    }
  }
  return true;
}; 

function zipCheck(list){
  for(var i = 0; i < list.length; i++){
    if(/^\d{5}(?:[-\s]\d{4})?$/.test(list[i].long_name)){
      return list[i].long_name;
    }
  }
}

function uploadImage() {
  $('input[type=file]').click();
}

function resize(file, maxWidth, maxHeight, fn){
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        var dataUrl = event.target.result;

        var image = new Image();
        image.src = dataUrl;
        image.onload = function(){
            var resizedDataUrl = resizeImage(image, maxWidth, maxHeight, 0.7);
            fn(resizedDataUrl);
        };
    };
}

function resizeImage(image, maxWidth, maxHeight, quality){
    var canvas = document.createElement('canvas');

    var width = image.width;
    var height = image.height;

    if(width > height){
        if(width > maxWidth){
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
        }
    } else {
        if(height > maxHeight){
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
}

module.exports = Entry;
