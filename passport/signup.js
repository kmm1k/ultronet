var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var mailer = require('../nodemailer/mailer');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                mailer();
                findOrCreateUser = function() {
                    // find a user in Mongo with provided username
                    if (!req.user) {
                    User.findOne({'local.username': username}, function (err, user) {
                        // In case of any error, return using the done method
                        if (err) {
                            console.log('Error in SignUp: ' + err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with username: ' + username);
                            return done(null, false, req.flash('message', 'User Already Exists'));
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.local.username = username;
                            newUser.local.password = createHash(password);
                            newUser.local.email = req.param('email');
                            newUser.local.displayName = req.param('displayName');

                            // save the user
                            newUser.save(function (err) {
                                if (err) {
                                    console.log('Error in Saving user: ' + err);
                                    throw err;
                                }
                                console.log('User Registration succesful');
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                        // user already exists and is logged in, we have to link accounts
                        var user = req.user; // pull the user out of the session

                        // update the current users facebook credentials
                        user.local.username = username;
                        user.local.password = createHash(password);
                        user.local.email = req.param('email');
                        user.local.displayName = req.param('displayName');

                        // save the user
                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}