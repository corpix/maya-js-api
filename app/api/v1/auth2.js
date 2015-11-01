var ResponseVK = require('ResponseVK');
var Response = require('Response');
var User = require(process.cwd() + '/app/db/entity/user.js');
var https = require('https');
var url = require('url');

module.exports = function (req, res, next) {
    new Response
        .Queue([
            res,
            getToken(req.query.code),
            getUserData
        ])
        .strict()
        .onResolve(function (friends) {
            /*User.create({
                id: uid,
                access_token: this.token,
                friends: friends,
                subscriptions: [],
                avatar: String,
                first_name: String,
                last_name: String
            })*/
        })
        .onResolve(sendResults)
        .onReject(function (error) {
            var redirect = JSON.parse(error.message).redirect_uri;

            //this.resolve(res);
            /*if (redirect) {
                res.redirect(redirect);
            }*/
        })
        .any(next)
        .done()
        .start();
};

function getUserData (uid, token) {
    var rvk = new ResponseVK(token);

    this
        .push(rvk
            .send('users.get', {
                user_ids: uid,
                fields: 'photo_100,first_name,last_name',
                v: '5.37'
            })
            .onResolve(resolveFirst))
        .push(rvk
            .send('friends.get', {
                user_id: uid,
                fields: 'sex,photo_100',
                v: '5.37'
            })
            .onResolve(resolveGirls)
    );
}

function getToken(code) {
    var r = new Response();
    var result = '';

    https
        .get(url.format({
            protocol: 'https:',
            host: 'oauth.vk.com',
            pathname: 'access_token',
            query: {
                client_id: '5129215',
                client_secret: 'Ku8QZmNCOshHVRz8Ha2Z',
                redirect_uri: 'http://104.238.189.178/api/v1/auth',
                code: code
            }
        }))
        .on('response', function (response) {
            response
                .on('data', function (chunk) {
                    result += chunk;
                })
                .on('end', function () {
                    result = JSON.parse(result);

                    if (result.error) {
                        r.reject(result.error_description);
                    } else {
                        console.log(result.user_id, result.access_token);
                        r.resolve(result.user_id, result.access_token);
                    }
                });
        })
        .on('error', function (error) {
            r.reject(error);
        });

    return r;
}

function sendResults(res, token, data, info, friends) {
    console.log('SEND');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send({
        info: info && info.getResult(),
        friends: friends && friends.getResult()
    });
}

function resolveFirst(results) {
    this.resolve(results[0]);
    console.log('INFO');
}

function resolveGirls(friends) {
    this.resolve(friends.items.filter(filterFriend));
    console.log('FRIENDS');
}

function filterFriend(friend) {
    return friend.sex === 1;
}
