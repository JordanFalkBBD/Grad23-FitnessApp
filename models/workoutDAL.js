const server = require("../models/Server");

class Metric {
  constructor(id, unit, value) {
    this.id = id;
    this.unit = unit;
    this.value = value;
  }
}

class Exercise {
  constructor(id, name, metrics) {
    this.id = id;
    this.name = name;
    this.metrics = metrics;
  }
}

class Workout {
  constructor(id, name, date) {
    this.id = id;
    this.name = name;
    this.date = date;
  }
}

const cardio = ["cardio"];

const weights = ["olympic_weightlifting", "powerlifting", "strength"];

function getMetricUnitsForExercise(type) {
  type = String(type).toLowerCase();
  if (weights.includes(type)) {
    return ["kg", "reps"];
  } else if (cardio.includes(type)) {
    return ["m"];
  }
  return ["None"];
}

function getMetricsForExercise(ExerciseID) {
  return [new Metric(5, "reps", 10), new Metric(4, "kg", 10)];
}

function getExercisesForWorkout(WorkoutID) {
  // newest to oldest exercise in workout
  server.fetchExercise(WorkoutID)
  .then(exercises => {
    return exercises;
  })
  .catch(error => {
  });
}

function getWorkoutsForUser(UserID) {
  let date = new Date();
  return {
    workouts: [
      new Workout(2, "Upper Body", date),
      new Workout(1, "Legs", new Date(date.setDate(date.getDate() - 1))),
    ],
  };
}

function getWorkoutFromID(WorkoutID) {
  let date = new Date();

  if (WorkoutID == 2) {
    return new Workout(2, "Upper Body", date);
  }

  return new Workout(1, "Legs", new Date(date.setDate(date.getDate() - 1)));
}

function addNewWorkout(userID, date, name) {
  let workout = new Workout(99, name, date); //newly created workout's ID

  return workout;
}

function updateWorkoutName(WorkoutID, newName) {
  //TODO: name changed
}

function getUserID() {
  return 0;
}

module.exports = {
  getExercisesForWorkout,
  getWorkoutsForUser,
  getWorkoutFromID,
  getMetricUnitsForExercise,
  addNewWorkout,
  updateWorkoutName,
  getUserID,
};
