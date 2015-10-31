var https = require('https');
var queryString = require('querystring');
var url = require('url');
var vkontakte = require('vkontakte');

module.exports = function (req, res, next) {
    var vk = vkontakte(req.query.token);
    var params = {
        user_id: req.query.uid,
        fields: 'nickname,sex,photo_100',
        v: '5.37'
    };

    vk('friends.get', params, function (error, friends) {
        if (error) {
            throw error;
        }

        res.send(friends.items.filter(filterFriend));
        next();
    });
};

function filterFriend(friend) {
    return friend.sex === 1;
}
