const express = require("express");
const router = express.Router();
const path = require("path");
const date = require("date-and-time");
const dal = require("../models/workoutDAL")

router.get("/", (req, res) => {
  req.session.userID = 

  res.sendFile(
    path.join(__dirname, "../views/components/workout-page/workoutPage.html")
  );
});

function getWorkoutIndex(workoutID, workouts) {
  return workouts.findIndex((workout) => workout.id == workoutID);
}

router.get("/next", async function (req, res) {
  // Retrieve the tag from our URL path
  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  let current = req.session.currentWorkoutId;

  let next_index = getWorkoutIndex(current, workouts) - 1;

  if (next_index >= 0) {
    req.session.currentWorkoutId = workouts[next_index].id;
  } else if (dal.getExercisesForWorkout(current.id).length > 0) {
    req.session.currentWorkoutId = dal.addNewWorkout(
      req.session.userID,
      new Date(),
      "New Workout"
    ).id;
  }

  res.redirect("/workout");
});

router.get("/prev", async function (req, res) {
  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  let current = req.session.currentWorkoutId;

  let prev_index = getWorkoutIndex(current, workouts) + 1;

  if (prev_index < workouts.length) {
    req.session.currentWorkoutId = workouts[prev_index].id;
  }

  res.redirect("/workout");
});

router.get("/info", (req, res) => {
  let workouts = dal.getWorkoutsForUser(req.session.userID).workouts;

  let workout = undefined;
  if (req.session.currentWorkoutId === undefined) {
    workout = workouts[0];
    req.session.currentWorkoutId = workout.id;
  } else {
    workout = dal.getWorkoutFromID(req.session.currentWorkoutId);
  }

  workout.date = date.format(workout.date, "dddd, D MMM");

  res.json(workout);
});

router.post("/update/name/:name", (req, res) => {
  var name = req.params.name;
  dal.updateWorkoutName(name);
});

module.exports = router;
