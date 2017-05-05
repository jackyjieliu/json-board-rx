var express = require('express')
var request = require('request');
var bodyParser = require('body-parser');
var accepts = require('express-accepts');
var app = express();
var port = process.env.PORT || 5000;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/health', function(req, res) {
  res.status(200).send({ healthy: true });
});

app.post('/feedback', accepts('application/json'), function (req, res) {
  var feedback = req.body.feedback;
  var email = req.body.email;
  console.log('Got request ' + email);
  console.log('Got request ' + feedback);

  var data =[
    'entry.1597674574=' + feedback,
    'entry.1342041182=' + email
  ].join('&');

  var url = 'https://docs.google.com/forms/d/1P_8XAplponW7wZUviOnUjkLxmG3uZKsdh_er3vozSKg';
  request.post({
    url: url + '/formResponse',
    headers: {
      'Accept': 'application/xml, text/xml, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: data
  }, (err) => {
    console.log('response', {err});
    if (!err) {
      res.status(200).send({ error: false });
    } else {
      res.status(400).send({ error: true });
    }
  });
});

app.listen(port, function () {
  console.log('App listening on port ' + port)
});
