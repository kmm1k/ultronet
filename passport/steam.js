var SteamStrategy = require('passport-steam').Strategy;
var User = require('../models/user');
var secrets = require('./secrets');


module.exports = function (passport) {
    passport.use('steam', new SteamStrategy({
            returnURL: 'http://localhost:3000/auth/steam/return',
            realm: 'http://localhost:3000/',
            apiKey: secrets.steamKey
        },
        function (identifier, profile, done) {
            User.findOne({'openId': profile.id}, function (err, user) {
                if (err) {
                    console.log('found an error');
                    return done(err);
                }
                //if user with id does not exist in db, make new user
                if (!user) {
                    console.log('Making user: ' + profile.displayName);
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.displayName = profile.displayName;
                    newUser.openId = profile.id;

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                } else {
                    return done(null, user);
                }
            });
        }));
}