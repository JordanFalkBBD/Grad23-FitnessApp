const express = require("express");
const router = express.Router();
const path = require("path");
const date = require("date-and-time");
const server = require("../models/Server");

router.get("/", async (req, res) => {
  req.session.userID = await server.fetchUserID(req.session.passport.user.email);

  res.sendFile(
    path.join(__dirname, "../views/components/workout-page/workoutPage.html")
  );
});

function getWorkoutIndex(workoutID, workouts) {
  return workouts.findIndex((workout) => workout.id == workoutID);
}

router.get("/next", async function (req, res) {
  // Retrieve the tag from our URL path
  const workouts = await server.fetchWorkouts(req.session.userID);

  let current = req.session.currentWorkoutId;

  const next_index = getWorkoutIndex(current, workouts) - 1;

  let exercises = await server.fetchExercise(current);

  if (next_index >= 0) {
    req.session.currentWorkoutId = workouts[next_index].id;
  } else if (exercises.length > 0) {
    req.session.currentWorkoutId = server.addNewWorkout(
      "New Workout",
      req.session.userID
    ).id;
  }

  res.redirect("/workout");
});

router.get("/prev", async function (req, res) {
  const workouts = await server.fetchWorkouts(req.session.userID);

  let current = req.session.currentWorkoutId;

  const prev_index = getWorkoutIndex(current, workouts) + 1;

  if (prev_index < workouts.length) {
    req.session.currentWorkoutId = workouts[prev_index].id;
  }

  res.redirect("/workout");
});

router.get("/info", async (req, res) => {
  const workouts = await server.fetchWorkouts(req.session.userID);

  let workout = undefined;
  if (req.session.currentWorkoutId === undefined) {
    workout = workouts[0];
    req.session.currentWorkoutId = workout.id;
  } else {
    workout = await server.getWorkoutFromID(req.session.currentWorkoutId);
  }

  workout.date = date.format(workout.date, "dddd, D MMM");

  res.json(workout);
});

router.post("/update/name/:name", async (req, res) => {
  const name = req.params.name;
  const current = req.session.currentWorkoutId;
  await server.updateWorkoutName(current, name);
});

module.exports = router;
