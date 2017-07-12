var express = require('express')
var request = require('request');
var bodyParser = require('body-parser');
var accepts = require('express-accepts');
// var mysql = require('mysql');
var pg = require('pg');
var _ = require('lodash');
var app = express();
var url = require('url')
var port = process.env.PORT || 5000;

var config = {
  max : 10,
  host: 'localhost',
  port: 5432,
  user: 'jackyjieliu',
  password: '',
  database: 'jackyjieliu'
};

if (process.env.DATABASE_URL) {

  var dbParams = url.parse(process.env.DATABASE_URL);
  var dbAuth = params.auth.split(':');

  config = {
    max : 10,
    host: dbParams.hostname,
    port: dbParams.port,
    user: dbAuth[0],
    password: dbAuth[1],
    database: dbParams.pathname.split('/')[1],
    ssl: true
  };
}


var jsonParsePool = new pg.Pool(config);

jsonParsePool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use(express.static('public'));
app.use(bodyParser.json());

//////// ===== feedback

app.get('/health', function(req, res) {
  res.status(200).send({ healthy: true });
});

app.post('/feedback', accepts('application/json'), function (req, res) {
  var feedback = req.body.feedback;
  var email = req.body.email;

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
    if (!err) {
      res.status(200).send({ error: false });
    } else {
      console.log('Feedback error', {err});
      res.status(400).send({ error: true });
    }
  });
});

///////===== shortenening

// var alphabet = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var ALPHABET = "PoeHi71W9m2KwSIDzVYac6hrk3CGOM0j5tnlvugXfNdyRbBpJAQLETUZsxF84q";

function encode(num){
  var encoded = '';
  var base = ALPHABET.length;
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = ALPHABET[remainder].toString() + encoded;
  }
  return encoded;
}

function decode(str){
  var decoded = 0;
  var base = ALPHABET.length;
  while (str){
    var index = ALPHABET.indexOf(str[0]);
    var power = str.length - 1;
    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
}

app.get('/data/:id', function(req, res) {
  var id = req.params.id;

  var numId = decode(id);

  if (!numId) {
    res.status(400).send({ error: true });
    return;
  }

  jsonParsePool.query('SELECT * FROM json_data WHERE id = $1', [numId], function (error, results) {
    if (error) {
      // log
      console.log('Get data error', { error, id, numId });
      res.status(400).send({ error: true });
    } else {
      var json = _.get(results, 'rows[0].json');
      if (json) {
        res.status(200).send({ json });
      } else {
        // log
        console.log('Get data error', { json, id });
        res.status(400).send({ error: true });
      }
    }
  });
});

app.post('/data', function(req, res) {
  var q = req.body.q;
  var now = Date.now();

  encode();
  jsonParsePool.query(
    'INSERT INTO json_data (json, time, type) VALUES ($1, $2, $3) RETURNING id',
    [q, now, 'JSON'],
    (error, results) => {

      if (error) {
        console.log('Set data error', { error, now });
        res.status(400).send({ error: true });
      } else {
        // const id = encode(results.insertId)

        const rawId = _.get(results, 'rows[0].id');
        if (!rawId) {
          res.status(400).send({ error: true });
        } else {
          const id = encode(Number(rawId));
          res.status(200).send({ id });
        }
      }
    }
  );
});

app.get('/cleanup', function(req, res) {
  res.status(200).send({ cleanup: true });
});

app.listen(port, function () {
  console.log('App listening on port ' + port)
});


// CREATE TABLE json_data (
//   id bigserial,
//   type VARCHAR DEFAULT NULL,
//   json text,
//   TIME BIGINT DEFAULT NULL,
//   PRIMARY KEY (id)
// );
