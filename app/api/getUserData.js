var https = require('https');
var queryString = require('querystring');
var url = require('url');
var vkontakte = require('vkontakte');

module.exports = function (req, res, next) {
    /*var vk = vkontakte(TOKEN);

    vk('friends.get', {
        fields: 'uid,first_name,photo'
    }).pipe(res);*/

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    var href = url.format({
        protocol: 'https',
        host: 'api.vk.com',
        pathname: 'method/friends.get',
        query: {
            user_id: '10628082',
            fields: 'sex,photo_100'
        }
    });

    https.get(href, function (response) {
        response.pipe(res);
    });
};
