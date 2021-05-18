

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

// Use the GoogleStrategy within Passport.
// Strategies in passport require a `verify` function, 
// which accept credentials (in this case, a token, 
// tokenSecret, and Google profile), and
// invoke a callback with a user object.
passport.use(new GoogleStrategy({
consumerKey: GOOGLE_CONSUMER_KEY,
consumerSecret: GOOGLE_CONSUMER_SECRET,
// This is the URL to which the user is redirected after
// they've been Google-authenticated:
callbackURL: "http://www.example.com/auth/google/callback"
},
function(token, tokenSecret, profile, done) {
User.findOrCreate({ googleId: profile.id }, function (err, user) {
return done(err, user);
});
}
));