var db = require('../../db');
var HTTPStatus = require('HTTPStatus');
var log = require('../../logger');

var User = db.entity.user.Model;

module.exports = function (req, res, next) {
    var onReject = function(err) {
        log.error(err);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).end();
    };

    var promise = new Promise(function(resolve, reject) {
        User.findOne(req.body, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    promise
        .then(function(data) {
            return new Promise(function(resolve, reject) {
                if(data) {
                    resolve(data);
                } else {
                    var user = new User(req.body);
                    user.save(function(err, user) {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                }
            });
        }, onReject)
        .then(function(data) {
            log.debug('Got auth data %j', data);
            res.status(HTTPStatus.ACCEPTED).end();
        }, onReject);
};
