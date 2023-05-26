const express = require("express");
const router = express.Router();
const path = require("path");
const date = require("date-and-time");
const workout_dal = require("../models/workoutDAL")
const passport = require("passport");
const user_dal = require("../models/userDAL")



router.get("/", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/components/workout-page/workoutPage.html")
  );
});

function getWorkoutIndex(workoutID, workouts) {
  console.log(workouts)
  return workouts.findIndex((workout) => workout.id == workoutID);
}

router.get("/next", async function (req, res) {
  const UserID = await user_dal.getUserID(req.user.email)
  // Retrieve the tag from our URL path
  let workouts = await workout_dal.getWorkoutsForUser(UserID);

  let current = req.session.currentWorkoutId;

  let next_index = getWorkoutIndex(current, workouts) - 1;

  if (next_index >= 0) {
    req.session.currentWorkoutId = workouts[next_index].id;
  } else if (await workout_dal.getExercisesForWorkout(current.id).length > 0) {
    req.session.currentWorkoutId = await workout_dal.addNewWorkout(
      UserID,
      new Date(),
      "New Workout"
    ).id;
  }

  res.redirect("/workout");
});

router.get("/prev", async function (req, res) {
  const UserID = await user_dal.getUserID(req.user.email)

  let workouts = await workout_dal.getWorkoutsForUser(UserID);

  let current = req.session.currentWorkoutId;

  let prev_index = getWorkoutIndex(current, workouts) + 1;

  if (prev_index < workouts.length) {
    req.session.currentWorkoutId = workouts[prev_index].id;
  }

  res.redirect("/workout");
});


router.get("/info", async (req, res) => {
  const UserID = await user_dal.getUserID(req.user.email)
  console.log("USER ID IN WORKOUT:? " + UserID);


  let workouts = await workout_dal.getWorkoutsForUser(UserID);

  let workout = undefined 

  if (workouts === undefined || workouts.length == 0){
    workout = await workout_dal.addNewWorkout(UserID)
    req.session.currentWorkoutId = workout.id;
  } else {
    if (req.session.currentWorkoutId === undefined) {
      workout = workouts[0];
      console.log(workout)
      // let date = String(workout.date).replace( /[-]/g, '/' );
      // date = Date.parse( date );
      // console.log(date)
      // workout.date = date
      req.session.currentWorkoutId = workout.id;
    } else {
      workout = await workout_dal.getWorkoutFromID(req.session.currentWorkoutId);
    }
  }

  workout.date = date.format(workout.date, "dddd, D MMM");

  res.json(workout);
});

router.post("/update/name/:name", (req, res) => {
  let name = req.params.name;
  workout_dal.updateWorkoutName(req.session.currentWorkoutId, name);
  res.status(200);
});

module.exports = router;
