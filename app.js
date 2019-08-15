var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require('mongoose');
 mongoose.connect('mongodb://mongo:27017/access');

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  return mongoose.connect('mongodb://mongo:27017/access')
}

var db = mongoose.connection;

db.on('error', err => {
  console.log('MongoDB connection error: ${err}')
  setTimeout(connectWithRetry, 5000)
 })

db.once('open', function (callback) {
    console.log("connection succeeded");
})
 

var app = express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/sign_up', function (req, res) {
    var userid = req.body.userid;
    var pass = req.body.password;

    if (userid == "admin" && pass == "e-bot7") {
        var data = {
            "userid": userid,
            "time": new Date(),
            "responce": "200"
        }
        db.collection('access').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");

        });
        res.end( userid );
    } else {
        var data = {
            "userid": userid,
            "time": new Date(),
            "responce": "404"
        }
        db.collection('access').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");

        });

        var query = { userid: userid };
        db.collection("errorCount").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result+" count : "+result.length);
            if (result.length == 0) {
                console.log("new record inserted");
                var errorData = {
                    "userid": userid,
                    "time": new Date(),
                    "count": 1
                }
                db.collection('errorCount').insertOne(errorData, function (err, collection) {
                    if (err) throw err;
                    res.end('Invalid username/password!');
                });
            } else if (result[0].count > 10) {
                var count = result[0].count;
               res.end('limit crossed');
                console.log("limit crossed");
            } else {
                console.log("record updated");
                var count = result[0].count;
                var countIncrimet = count+1;
                var myquery = {_id: result[0]._id };
                console.log(countIncrimet);
                var newvalues = { $set: { count: countIncrimet } };
                db.collection("errorCount").updateOne(myquery, newvalues, function (err, resp) {
                    if (err) throw err;
                   // console.log(resp);
                    res.end('Invalid username/password!');
                });

            }

        });


    }


});


app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('index.html');
}).listen(3000)


console.log("server listening at port 3000");