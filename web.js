var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function fooRoute(req, res, next) {
	res.send();
}

app.set('port', (process.env.PORT || 9000));

app.use('/node_modules/', express.static(__dirname + "/node_modules/"));
app.use('/', express.static(__dirname + "/public"));

app.listen(app.get('port'), function() {
	console.log("Running app on port " + app.get('port') + ".");
});

