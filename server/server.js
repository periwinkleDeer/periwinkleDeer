var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var db = require('./db');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');

app.use(cors());
app.use(bodyParser.urlencoded());

app.set('port', (process.env.PORT || 8080));

app.use(express.static('dist'));
app.use(favicon('/dist/assets/myIcon.ico'));
require('./routes')(app);
// var port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'test') {
  var server = app.listen(app.get('port'), function() {
    db.sequelize.sync();
    console.log("Listening on " + app.get('port'));
  });
} else {
  var server = db.sequelize.sync().then(function() {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  });
}

// module.exports.app = app;
module.exports.server = server;

