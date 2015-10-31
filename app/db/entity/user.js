var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: String,
    token: String
});

var User = mongoose.model('User', userSchema);

module.exports = {schema: userSchema, Model: User};
