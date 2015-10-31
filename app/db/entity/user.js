var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
    access_token: String
});

userSchema.path('access_token')
    .validate(function (value) {
        return /[a-f0-9]+/.test(value);
    }, 'Invalid token')
    .required(true);

var User = mongoose.model('User', userSchema);

module.exports = {schema: userSchema, Model: User};
