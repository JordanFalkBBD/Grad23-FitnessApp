const express = require("express");
const router = express.Router();
const path = require("path");
const dal = require("../models/Server");

router.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/components/summary-page/summaryPage.html")
  );
});

router.get("/exercises/:userID", (req, res) => {
  dal
    .fetchExercisesForUser(req.params.userID)
    .then((response) => res.json(response));
});

module.exports = router;
