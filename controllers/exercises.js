const express = require("express");
const router = express.Router();
const dal = require("../models/workoutDAL");

router.get("/", (req, res) => {
  let exercises = dal.getExercisesForWorkout(
    req.session.currentWorkoutId
  ).exercises;
  let grouped_exercises = {};

  for (let exercise of exercises) {
    if (!(exercise.name in grouped_exercises)) {
      grouped_exercises[exercise.name] = [];
    }

    let exercise_group = grouped_exercises[exercise.name];

    let set = {
      number:
        exercises.filter((x) => x.name == exercise.name).length -
        exercise_group.length,
      metrics: exercise.metrics,
    };

    exercise_group.push(set);
    grouped_exercises[exercise.name] = exercise_group;
  }

  res.json(grouped_exercises);
});

router.get("/metrics/:type", (req, res) => {
  var type = req.params.type;
  res.json(dal.getMetricUnitsForExercise(type));
});

router.post("/add", (req, res) => {
  res.status(200);
  res.end();
});

module.exports = router;
