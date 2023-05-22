const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require('https').globalAgent.options.rejectUnauthorized = false;
const config = require("../config");

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
        // TODO: add/associate user to db records
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/workout",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/google/failure", (req, res) => {
  res.send("Something went wrong with Google authentication");
});

module.exports = router;
