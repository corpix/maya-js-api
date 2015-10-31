var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
    access_token: String,
    friends: Array,
    subscriptions: Array,
    avatar: String,
    first_name: String,
    last_name: String
});

var User = mongoose.model('User', userSchema);

module.exports = {
    schema: userSchema,
    Model: User
};
