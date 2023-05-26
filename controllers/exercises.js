const express = require("express");
const router = express.Router();
const dal = require("../models/workoutDAL");
const bodyParser = require('body-parser')

router.get("/", (req, res) => {
  dal.getExercisesForWorkout(req.session.currentWorkoutId)
    .then(exercises => {
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

      res.json(grouped_exercises)

    })
    .catch(error => {
      res.json(error)
    });
});

router.get("/metrics/:type", (req, res) => {
  let type = req.params.type;
  res.json(dal.getMetricUnitsForExercise(type));
});

router.post("/add", bodyParser.json(), async (req, res) => {
  const exercise = req.body.body

  let weight = exercise.kg;
  let reps = exercise.reps;
  let distance = exercise.km;

  const added = await dal.addExercise(exercise.exercise_name, req.session.currentWorkoutId, weight, reps, distance)
  if (added === null) {
    res.status(400);
  }
  res.status(200);
  res.end();
});

module.exports = router;
