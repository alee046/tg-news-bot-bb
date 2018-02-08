var express = require('express');
var packageInfo = require('./package.json');
const tokens = require( './config.js' );
var app = express();

var bodyParser = require('body-parser');

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});
app.use(bodyParser.json());

app.post('/' + tokens.botToken, function (req, res) {
  bot.processUpdate(req.body);
  // res.json(res);
  res.sendStatus(200);
});

var server = app.listen((process.env.PORT || 5000), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
});