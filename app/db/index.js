var MongoClient = require('mongodb').MongoClient;

function connect(url) {
    return new Promise(function(resolve, reject) {
        // Use connect method to connect to the Server
        MongoClient.connect(url, function(err, db) {
            if (err === null) {
                resolve(db);
            } else {
                reject(err);
            }
        });
    });
}


module.exports = {
    connect: connect
};
