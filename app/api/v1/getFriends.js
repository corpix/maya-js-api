var ResponseVK = require('ResponseVK');
var Response = require('Response');
var User = require(process.cwd() + '/app/db/entity/user.js');
var https = require('https');
var url = require('url');

module.exports = function (req, res, next) {
    var rvk = new ResponseVK(req.query.token);
    var uid = req.query.uid;

    https
        .get(url.format({
            protocol: 'https',
            host: 'oauth.vk.com',
            pathname: 'access_token',
            query: {
                client_id: '5119199',
                client_secret: 'gYn9y6R9Oh6I9xlD7qsM',
                redirect_uri: 'http://104.238.189.178/',
                code: req.query.code
            }
        }), function (error, result) {
            if (error) {
                throw error;
            }

            console.log(result);
        });

    var info = rvk
        .send('users.get', {
            user_ids: uid,
            fields: 'photo_100,first_name,last_name',
            v: '5.37'
        })
        .onResolve(function (results) {
            this.resolve(results[0]);
        });

    var friends = rvk
        .send('friends.get', {
            user_id: uid,
            fields: 'sex,photo_100',
            v: '5.37'
        })
        .onResolve(function (friends) {
            this.resolve(friends.items.filter(filterFriend));
        });

    new Response.Queue([res, info, friends])
        .strict()
        .onResolve(function (friends) {
            User.create({
             id: uid,
             access_token: this.token,
             friends: friends,
             subscriptions: [],
             avatar: String,
             first_name: String,
             last_name: String
             })
        })
        .onResolve(function (res, info, friends) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send({
                info: info.getResult(),
                friends: friends.getResult()
            });
        })
        .any(next)
        .start();

};

function filterFriend(friend) {
    return friend.sex === 1;
}
