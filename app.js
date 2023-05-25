const https = require("https");
const fs = require("fs");
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
const user = require("./controllers/user");
const isLoggedIn = require("./controllers/middleware");
const config = require("./config");

const app = express();
app.use(express.static(path.join(__dirname, "views", "assets")));
app.use(express.static(path.join(__dirname, "views", "components", "auth-page")));
app.use(express.static(path.join(__dirname, "views", "components", "profile-modal")));
app.use(express.static(path.join(__dirname, "views", "components", "summary-page")));
app.use(express.static(path.join(__dirname, "views", "components", "workout-page")));
app.use(
    session({
      secret: config.session_secret,
      resave: false,
      saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", routes);
app.use("/summary", isLoggedIn, summary);
app.use("/workout", isLoggedIn, workout);
app.use("/exercises", exercises);
app.use("/ninja", ninja);
app.use("/users", user);

// Google authentication routes
app.use("/auth", auth);

// Start server
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
}

https.createServer(options, app).listen(config.port, function () {
  console.log(`Example app listening on port ${config.port}!`);
  console.log(`Visit http://localhost:${config.port}`);
});

