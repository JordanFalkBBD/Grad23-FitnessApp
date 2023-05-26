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
  workouts.reverse()
  return workouts.findIndex((workout) => workout.id == workoutID);
}

router.get("/next", async function (req, res) {
  const UserID = await user_dal.getUserID(req.user.email)
  // Retrieve the tag from our URL path
  let workouts = await workout_dal.getWorkoutsForUser(UserID);

  let current = Number(req.session.currentWorkoutId);

  let next_index = getWorkoutIndex(current, workouts) - 1;

  if (next_index >= 0) {
    console.log("Getting Next workout")
    req.session.currentWorkoutId = workouts[next_index].id;
  } else {
    console.log("Creating new workout")
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

  let current = Number(req.session.currentWorkoutId);

  let prev_index = getWorkoutIndex(current, workouts) + 1;

  if (prev_index < workouts.length) {
    console.log("Getting Prev workout")
    req.session.currentWorkoutId = workouts[prev_index].id;
  }

  res.redirect("/workout");
});


router.get("/info", async (req, res) => {
  const UserID = await user_dal.getUserID(req.user.email)

  let workouts = await workout_dal.getWorkoutsForUser(UserID);
  workouts.reverse()
  console.log("All workouts: ")
  console.log(workouts)

  let workout = undefined 

  if (workouts === undefined || workouts.length == 0){
    console.log("adding new workout")
    workout = await workout_dal.addNewWorkout(UserID)
    req.session.currentWorkoutId = workout.id;
  } else {
    if (req.session.currentWorkoutId === undefined) {
      console.log("getting newest workout")

      workout = workouts[0];
      // let date = String(workout.date).replace( /[-]/g, '/' );
      // date = Date.parse( date );
      // console.log(date)
      // workout.date = date
      req.session.currentWorkoutId = workout.id;
    } else {
      console.log("getting workout with id: "+ req.session.currentWorkoutId)
      for (let workout_item of workouts){
        if (workout_item.id == req.session.currentWorkoutId){
          workout = workout_item;
        }
      }
    }
  }
  
  console.log("Workout loaded: ")
  console.log(workout)

  workout.date = date.format(workout.date, "dddd, D MMM");

  res.json(workout);
});

router.post("/update/name/:name", (req, res) => {
  let name = req.params.name;
  workout_dal.updateWorkoutName(Number(req.session.currentWorkoutId), name);
  res.status(200);
});

module.exports = router;
