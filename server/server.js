var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
app.use(bodyParser.json());
app.use(cors());

var mongooseConnection = process.env.MONGOLAB_URL || 'mongodb://localhost/foodies';
mongoose.connect(mongooseConnection);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback) {
  console.log('Connected to Mongo');
});

app.use(express.static('dist'));

var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

module.exports.server = server;