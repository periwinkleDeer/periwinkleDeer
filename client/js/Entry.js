var Rating = require('react-rating');

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

var Entry = React.createClass({
   getInitialState: function(){
       return {};
   },

   componentDidMount: function(){
      var self = this;
      var input = document.getElementById('restaurant');
      var options = {
        types: ['establishment']
      };

      var autocomplete = new google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', function(){
        var place = autocomplete.getPlace();

        console.log(place);
        self.setState({
         restaurant: place
        });
        console.log(self.state.restaurant);
      });
   },

   handleSubmit: function(){
      var store = {
         restaurant : this.state.restaurant.name,
         address    : this.state.restaurant.formatted_address,
         zip        : this.state.restaurant.address_components[5],
         phone      : this.state.restaurant.formatted_phone_number,
         rating     : this.state.restaurant.rating,
         dishName   : document.getElementById('dish').value,
         dishRating : this.foodRate,
         dishPrice  : this.priceRate,
         imgUrl     : this.state.dataUrl
      };

       $.ajax({
           url: "/insertdish",
           type: "POST",
           data: store,
           success: function(data) {
               // do stuff
               console.log(data);
           }.bind(this),
           error: function(xhr, status, err) {
               // do stuff
               console.log(xhr, status, err);
           }.bind(this)
       });
       return false;
   },

   onChange: function(e){
       var files = e.target.files;
       var self = this;
       var maxWidth = this.props.maxWidth;
       var maxHeight = this.props.maxHeight;
       resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
           self.setState({ dataUrl: resizedDataUrl });
       });
   },

   priceRate: function(value){
      this.priceRate = value;
      var values = {
         1: "under $10",
         2: "$10 - $20",
         3: "$20 - $30",
         4: "$30 - $40"
      };
      $('.popup').text(values[value]);
   },

   foodRate: function(value){
      this.foodRate = value;
   },

   render: function(){
      var style = {
        color: 'white',
        fontSize: 13
      };

       var image;

       var dataUrl = this.state.dataUrl;
       if(dataUrl){
         image = <img src={dataUrl}/>
       }

       return (
        <div className="container">
           <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">

             <div className="form-group">
              <label>Restaurant</label>
               <input type="text" className="form-control" id="restaurant" placeholder="Where did you eat?"/>
             </div>

             <div className="form-group">
              <label>Foodie</label>
               <input type="text" className="form-control" id="dish" placeholder="What did you eat?"/>
             </div>

             <div className="form-group">
                 <label for="exampleInputFile">Upload Picture</label>
                 <input style={style} ref="upload" type="file" accept="image/*" onSubmit={this.handleSubmit} onChange={this.onChange}/>
                 <p className="help-block">{ image }</p>
             </div>           

             <div className="form-group">
             <label>Category</label>
               <select id="category" className="form-control">
                 <option>Snack</option>
                 <option>Grub</option>
                 <option>Dessert</option>
               </select>
             </div>

             <div className="form-group">
              <label>Price Rating</label>
              <div className="rating" id="rating-fontawesome-star"></div>
                 <Rating empty="glyphicon glyphicon-usd usd" full="glyphicon glyphicon-usd green usd" start={0} stop={4} step={1} onChange={this.priceRate}/>
                 <span className="popup"></span>
             </div>

             <div className="form-group">
              <label>Rate Your Foodie!</label>
              <div className="rating" id="rating-fontawesome-star"></div>
                 <Rating empty="glyphicon glyphicon-star-empty star" full="glyphicon glyphicon-star orange star" start={0} stop={5} step={1} onChange={this.foodRate}/>
             </div>

               <button className="btn btn-warning form-control" onClick={this.handleClick}>Share My Thoughts!</button>

           </div>
        </div>
       )
   }
});

var Test = React.createClass({

    onChange: function(file){
        console.log('done', file);
    },

    render: function(){
        return <div>
            <Entry className="entry" maxHeight={250} maxWidth={250} onChange={ this.onChange } />
        </div>
    }
});

module.exports = Entry;
module.exports = Test;
