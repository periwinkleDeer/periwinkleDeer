var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(bodyParser.json());
app.use(cors());


app.use(express.static('dist'));
require('./routes')(app);
var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

// module.exports.app = app;
module.exports.server = server;

