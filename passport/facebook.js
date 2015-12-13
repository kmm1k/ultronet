var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var secrets = require('./secrets');

module.exports = function (passport) {
    passport.use('facebook', new FacebookStrategy({
            clientID: secrets.facebook.clientId,
            clientSecret: secrets.facebook.secret,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            passReqToCallback: true,
            profileFields: ['emails', 'displayName']
        },
        function (req, accessToken, refreshToken, profile, done) {

            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err) {
                            console.log('found an error');
                            return done(err);
                        }
                        //if user with id does not exist in db, make new user
                        if (!user) {
                            console.log(profile);
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.facebook.id    = profile.id;
                            newUser.facebook.token = accessToken;
                            newUser.facebook.displayName = profile.displayName;
                            newUser.facebook.email = profile.emails[0].value;

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
                            if (!user.facebook.token) {
                                user.facebook.token = accessToken;
                                user.facebook.displayName  = profile.displayName;
                                user.facebook.email = profile.emails[0].value;

                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    // update the current users facebook credentials
                    user.facebook.id = profile.id;
                    user.facebook.token = accessToken;
                    user.facebook.displayName = profile.displayName;
                    user.facebook.email = profile.emails[0].value;

                    // save the user
                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }
    ));
}