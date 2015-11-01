var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var db = require('./db');

var route = require('./config/route');
var config = require('./config/app');
var log = require('./logger');

if(config.isProd()) {
    process.env.ENV = 'production';
} else {
    process.env.ENV = 'development';
}

app.use(bodyParser.json());

for (var path in route) {
    if (route.hasOwnProperty(path)) {
        app[route[path].method](path, require('./' + route[path].module));
    }
}

log.info('Starting with ENV %s ...', process.env.ENV);

db.connect(config.db.url)
    .then(function() {
        var server = app.listen(3001, function () {
            var host = server.address().address;
            var port = server.address().port;

            log.info('App listening at http://%s:%s', host, port);
        });
    }, function(err) {
        log.error("Got an error while connecting to database", err);
        process.exit(1);
    });
