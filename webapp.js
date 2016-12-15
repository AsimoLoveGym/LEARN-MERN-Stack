var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var db;
var path = require('path');

app.use(express.static(path.join(__dirname, 'static')));

// var bugData = [
//   { id: 1, priority: 'P1', status: 'Open', owner: 'Ravan', title: 'App crashes on open' },
//   { id: 2, priority: 'P2', status: 'New', owner: 'Eddie', title: 'Misaligned border on panel' },
// ];

app.get('/api/bugs', function (req, res) {
  // res.status(200).send(JSON.stringify(bugData));
  // res.json(bugData);
  db.collection("bugs").find().toArray(function (err, docs) {
    res.json(docs);
  });
});

app.use(bodyParser.json());
app.post('/api/bugs', function (req, res) {
  console.log("Req body:", req.body);
  var newBug = req.body;
  // newBug.id = bugData.length + 1;
  // bugData.push(newBug);
  // res.json(newBug);

  db.collection("bugs").insertOne(newBug, function (err, result) {
    var newId = result.insertedId;
    db.collection("bugs").find({ _id: newId }).next(function (err, doc) {
      res.json(doc);
    });
  });
});

// app.get('/', function (req, res) {
//   res.send('Hello Express again!');
// });
//
// app.get('/index', function (req, res) {
//   res.send('Hello Express again!');
// });

MongoClient.connect('mongodb://localhost/bugsdb', function (err, dbConnection) {
  db = dbConnection;
  var listener = app.listen('3000', function () {
    var port = listener.address().port;
    console.log('Example app listening on port', port);
  });
});
