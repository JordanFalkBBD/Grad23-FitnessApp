const express = require("express");
const router = express.Router();
const path = require("path");
const dal = require("../models/summaryDAL");

router.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/components/summary-page/summaryPage.html")
  );
});

router.get("/exercises/:userID", async (req, res) => {
  const data = await dal.fetchExercisesForUser(req.params.userID);
  res.json(JSON.stringify(data));
});

router.get("/cardio/:userID", async (req, res) => {
  const data = await dal.fetchCardioForUser(req.params.userID);
  res.json(JSON.stringify(data));
});

module.exports = router;
