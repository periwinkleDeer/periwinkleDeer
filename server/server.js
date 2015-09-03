var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var db = require('./db');
var http = require('http');
app.use(bodyParser.json());
app.use(cors());
//INVWNVKLJWNVKWJNVKJVNKSDJVKSDJVNKSDJVN

app.set('port', (process.env.PORT || 8080));
app.use(express.static('dist'));
require('./routes')(app);
// var port = process.env.PORT || 8080;

var server = db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

// var server = app.listen(app.get('port'), function() {
//   console.log("Listening on " + app.get('port'));
// });

// module.exports.app = app;
module.exports.server = server;

