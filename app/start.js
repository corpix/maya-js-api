var express = require('express');
var app = express();

var route = require('./config/route');

for (var path in route) {
    if (route.hasOwnProperty(path)) {
        app.get(path, require('./' + route[path]));
    }
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
