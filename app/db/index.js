var mongoose = require('mongoose');

function connect(url) {
    return new Promise(function(resolve, reject) {
        mongoose.connect(url);
        var db = mongoose.connection;
        db.on('error', reject);
        db.once('open', resolve);
    });
}

module.exports = {
    connect: connect,
    entity: {
        user: require('./entity/user')
    }
};
