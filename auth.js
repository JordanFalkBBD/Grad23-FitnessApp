const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// TODO: Create process.env variables for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
const GOOGLE_CLIENT_ID = '48579065357-mkqbtlvpfs2fkh1r0vpk32etc1rgnsad.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true,
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
