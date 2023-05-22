const express = require("express");
const router = express.Router();
const isLoggedIn = require("./middleware");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(
      path.join(__dirname, "../views/components/auth-page/auth.html")
  );
});

router.get("/user", isLoggedIn, (req, res) => {
  let user = req.user.displayName;
  res.json(user);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(function (err) {
    if (err) {
      res.send("An error occurred while logging you out.");
    } else {
      req.session.destroy();
      res.send('<p>You have logged out!</p> <a href="/">Go to home</a>');
    }
  });
});

module.exports = router;
