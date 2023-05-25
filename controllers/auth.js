const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require('https').globalAgent.options.rejectUnauthorized = false;
const config = require("../config");
const server = require("../models/Server");

// Google authentication
passport.use(
    new GoogleStrategy(
        {
            clientID: config.google_client_id,
            clientSecret: config.google_client_secret,
            callbackURL: config.google_callback_url,
            passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
            server.addNewUser(profile.email, 1);
            return done(null, profile);
        }
    )
);

// Serialization and deserialization of users
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Routes
router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"],
}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/workout",
    failureRedirect: "/auth/google/failure",
}));

router.get("/google/failure", (req, res) => {
    res.send("Something went wrong with Google authentication");
});

module.exports = router;
