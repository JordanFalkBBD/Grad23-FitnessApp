const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const routes = require("./controllers/index");
const auth = require("./controllers/auth");
const workout = require("./controllers/workout");
const exercises = require("./controllers/exercises");
const summary = require("./controllers/summary");
const ninja = require("./controllers/ninja");
const isLoggedIn = require("./controllers/middleware");
const config = require("./config")

const app = express();

// TODO: Add SESSION_SECRET to process.env
const SESSION_SECRET = "secret";
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "views")));

// Routes
app.use("/", routes);
app.use("/summary", isLoggedIn, summary);
app.use("/workout", isLoggedIn, workout);
app.use("/exercises", exercises);
app.use("/ninja", ninja);

// Google authentication routes
app.use("/auth", auth);

// Start server
app.listen(config.port, function () {
  console.log(`Example app listening on port ${config.port}!`);
  console.log(`Visit http://localhost:${config.port}`);
});
