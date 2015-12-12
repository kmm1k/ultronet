var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: '930524297024519',
        clientSecret: 'f92b034bcad0583f4f416c9ad39593f8',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ 'username' :  profile.displayName }, function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));