const express = require("express");
const router = express.Router();
const dal = require("../models/workoutDAL");


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

      res.json(grouped_exercises);
    })
    .catch(error => {
      res.json(error)
    });
});

router.get("/metrics/:type", (req, res) => {
  var type = req.params.type;
  res.json(dal.getMetricUnitsForExercise(type));
});

router.post("/add", async (req, res) => {
  const exercise = req.body

  let weight = null;
  let reps = null;
  let distance = null;

  for (metric of exercise.metrics){
    switch (metric.unit) {
      case "kg": 
        weight = metric.value;
        break;
      
      case "reps": 
        reps = metric.value;
        break;

      case "distance": 
        distance = metric.value;
        break;
    }
  }

  const added = await dal.addExercise(exercise.exercise_name, req.session.currentWorkoutId, weight, reps, distance)
  if (added === null){
    res.status(400);
  }
  res.status(200);
  res.end();
});

module.exports = router;
