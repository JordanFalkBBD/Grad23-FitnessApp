const sql = require("mssql");
const config = require("./Server");

class Exercise {
  constructor(id, name, weight, sets, reps, date) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.sets = sets;
    this.reps = reps;
    this.date = date;
  }
}

class Cardio {
  constructor(id, name, distance, date) {
    this.id = id;
    this.name = name;
    this.distance = distance;
    this.date = date;
  }
}

async function fetchExercisesForUser(userID) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
      select Exercises.ExerciseID, Exercises.Name, Exercises.Weight, Exercises.Sets, Exercises.Reps, Exercises.Date 
      from Exercises 
      left outer join Workout on Exercises.WorkoutID = Workout.WorkoutID
      where Workout.UserID = ${userID}`);
    const exercises = result.recordset.map((row) => {
      return new Exercise(
        row.ExerciseID,
        row.Name,
        row.Weight,
        row.Sets,
        row.Reps,
        row.Date
      );
    });

    await sql.close();

    return exercises;
  } catch (error) {
    console.error("fetchExercisesForUser");
  }
}

async function fetchCardioForUser(userID) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
      select Cardio.CardioID, Cardio.Name, Cardio.Distance, Cardio.Date 
      from Cardio
      left outer join Workout on Cardio.WorkoutID = Workout.WorkoutID
      where Workout.UserID = ${userID}`);

    const exercises = result.recordset.map((row) => {
      return new Cardio(row.CardioID, row.Name, row.Distance, row.Date);
    });

    await sql.close();

    return exercises;
  } catch (error) {
    console.error("fetchCardioForUser");
  }
}

module.exports = {
  fetchExercisesForUser,
  fetchCardioForUser,
};
