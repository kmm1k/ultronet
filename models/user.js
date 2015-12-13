var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    local: {
        email       : String,
        password    : String,
        displayName : String,
        username    : String
    },
    facebook: {
        id          : String,
        token       : String,
        email       : String,
        displayName : String
    },
    twitter: {
        id          : String,
        token       : String,
        displayName : String,
        username    : String
    },
    google: {
        id          : String,
        token       : String,
        email       : String,
        displayName : String
    }
});