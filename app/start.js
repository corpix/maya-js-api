var express = require('express');
var app = express();
var db = require('./db');

var route = require('./config/route');
var config = require('./config/app');

for (var path in route) {
    if (route.hasOwnProperty(path)) {
        app.get(path, require('./' + route[path]));
    }
}

db.connect(config.db.url)
    .then(function(db) {
        var server = app.listen(3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s', host, port);
        });
    }, function(err) {
        console.error("Got an error while connecting to database", err);
        process.exit(1);
    });
