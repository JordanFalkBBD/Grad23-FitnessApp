const express = require("express");
const router = express.Router();
const path = require("path");
const dal = require("../models/workoutDAL");

router.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/components/workout-page/workoutPage.html")
  );
});

router.get("/next", async function (req, res) {
  // Retrieve the tag from our URL path
  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  current = req.session.currentWorkout;

  for (let i = 1; i < workouts.length; i++) {
    if (workouts[i].id == current) {
      req.session.currentWorkout = workouts[i - 1].id;
    }
  }

  res.redirect("/workout");
});

router.get("/prev", async function (req, res) {
  // Retrieve the tag from our URL path
  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  current = req.session.currentWorkout;

  for (let i = workouts.length; i > 1; i++) {
    if (workouts[i].id == current) {
      req.session.currentWorkout = workouts[i + 1].id;
    }
  }

  res.redirect("/workout");
});

router.get("/info", (req, res) => {
  req.session.userID = 0;

  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  let workout = undefined;
  if (req.session.currentWorkout === undefined) {
    workout = workouts[0];
    req.session.currentWorkout = workout.id;
  } else {
    workout = dal.getWorkoutFromID(req.session.currentWorkout);
  }

  workout.date = date.format(workout.date, "dddd, D MMM");

  res.json(workout);
});

module.exports = router;
