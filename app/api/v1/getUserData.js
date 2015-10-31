var ResponseVK = require('ResponseVK');
var Response = require('Response');

module.exports = function (req, res, next) {
    var rvk = new ResponseVK(req.query.token);
    var uid = req.query.uid;
    var photoCache = {};
    var result = [];


    var photos = rvk
        .send('photos.getAll', {
            owner_id: uid,
            extended: 1,
            count: 200,
            no_service_albums: 0,
            skip_hidden: 0,
            v: '5.37'
        })
        .onResolve(function (photos) {
            var index = photos.items.length;

            while (index) {
                var photo = new Photo(photos.items[--index]);

                photoCache[photo.id] = photo;
                result.push(photo);
            }
        });

    var comments = rvk
        .send('photos.getAllComments ', {
            owner_id: uid,
            need_likes: 1,
            count: 100,
            v: '5.37'
        });

    new Response
        .Queue([
            res,
            photos,
            comments,
            function (comments) {
                var index = 0;
                var length = comments.items.length;
                var users = [];
                var userCache = {};

                while (index < length) {
                    var comment = comments.items[index];
                    var photo = photoCache[comment.pid];
                    var userId = comment.from_id;
                    var hasUser = userCache.hasOwnProperty(userId);
                    var user = hasUser ? userCache[userId] : new User(userId);

                    if (photo) {
                        photo.comments.push(new Comment(comment, user));
                    }

                    if (!hasUser) {
                        users.push(userId);
                        userCache[userId] = user;
                    }

                    index++;
                }

                return rvk
                    .send('users.get', {
                        user_ids: users.join(','),
                        fields: 'sex',
                        v: '5.37'
                    })
                    .onResolve(function (users) {
                        var index = users.length;

                        while (index) {
                            var user = users[--index];

                            userCache[user.id].update(user);
                        }
                    });
            }
        ])
        .onResolve(function (res, photos, comments, users) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(result);
        })
        .any(next)
        .start();

    /*rvk
        .send('execute.getAvatars', {
            uid: uid,
            v: '5.37'
        })
        /!*.onResolve(processingData)*!/
        .onResolve(function (result) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(result);
        })
        .any(next);*/
/*
    var posts = rvk
        .send('wall.get', {
            owner_id: uid,
            count: 100,
            filter: 'owner',
            extended: 1,
            v: '5.37'
        })
        .onResolve(processingPosts)
        .any('next');

    new Response.Queue([res, photos, posts], true)
        .onResolve(sendResults)
        .any(next);*/
};

function User (id) {
    this.id = id;
    this.first_name = null;
    this.last_name = null;
    this.sex = null;
}

User.prototype.update = function (options) {
    this.first_name = options.first_name;
    this.last_name = options.last_name;
    this.sex = options.sex;
};

function Comment (options, user) {
    this.id = options.id;
    this.user = user;
    this.date = options.date;
    this.text = options.text;
    this.likes = options.likes.count;
}

function Photo (options) {
    this.id = options.id;
    this.album_id = options.album_id;
    this.text = options.text;
    this.date = options.date;
    this.post_id = options.post_id;
    this.likes = options.likes.count;
    this.comments = [];
}
