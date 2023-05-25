var sql = require("mssql");
const date = require("date-and-time");

var config = {
  user: "root",
  password: "FitnessApp",
  server: "mssqldb.cjovnczdjuek.eu-west-1.rds.amazonaws.com",
  database: "FitnessAppDB",
  trustServerCertificate: true,
};


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

class Metric {
  constructor(unit, value) {
    this.unit = unit;
    this.value = value;
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

async function getWorkoutsForUser(user) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select WorkoutID, Name, UserID, Date from Workout where UserID = ${user}`
    );

    const workouts = result.recordset.map((row) => {
      return new Workout(row.WorkoutID, row.Name, row.Date);
    });

    await sql.close();

    return workouts;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function getWorkoutFromID(WorkoutID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select WorkoutID, Name, UserID, Date from Workout where WorkoutID = ${WorkoutID}`
    );

    const workout = result.recordset.map((row) => {
      return new Workout(row.WorkoutID, row.Name, row.Date);
    })[0];

    await sql.close();

    return workouts;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function getMetricsForExercise(exerciseID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select Weight, Reps from Exercises where ExerciseID = ${exerciseID}`
    );

    const exercises = result.recordset.map((row) => {
      return [
        new Metric(row.Weight, "Kg"),
        new Metric(row.Reps, "Reps"),
      ]
    }
    );

    await sql.close();

    return exercises;
  } catch (ignored) {
    try {
      await sql.connect(config);

      const result = await sql.query(
        `select Distance from Cardio where ExerciseID = ${exerciseID}`
      );

      const exercises = result.recordset.map((row) => {
        return [
          new Metric(row.Distance, "Km")
        ]
      }
      );

      await sql.close();

      return exercises;
    } catch (error) {

      console.error("Error:", error.message);
      throw error;
    }
  }
}

async function getExercisesForWorkout(workout) {
  try {
    await sql.connect(config);

    const strength = await sql.query(
      `select ExerciseID as ID, Name, Date from Exercises where WorkoutID = ${workout}`
    );

    const cardio = await sql.query(
      `select CardioID as ID, Name, Date from Cardio where WorkoutID = ${workout}`
    );

    const exercises = strength.recordset.map((row) => {
      return new Exercise(
        row.ID,
        row.Name,
        row.Date
      );
    }) + cardio.recordset.map((row) => {
      return new Exercise(
        row.ID,
        row.Name,
        row.Date
      );
    });

    await sql.close();

    return exercises;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function addNewWorkout(UserID) {
  try {
    await sql.connect(config);
    const now = new Date();

    const insertResult = await sql.query(`
        INSERT INTO Workout (Name, UserID, Date)
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        VALUES ('New Workout', ${UserID}, '${now}');`);

    const newWorkout = new Workout(
      insertResult.recordset[0].WorkoutID,
      insertResult.recordset[0].Name,
      insertResult.recordset[0].Date
    );

    await sql.close();

    return newWorkout;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function updateWorkoutName(WorkoutID, newName) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
        UPDATE Workout
        SET Name = '${newName}'
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        WHERE WorkoutID = ${WorkoutID};`);

    const updatedWorkout = new Workout(
      result.recordset[0].WorkoutID,
      result.recordset[0].Name,
      result.recordset[0].Date
    );

    await sql.close();

    return updatedWorkout;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function addNewWorkout(name, user) {
  try {
    await sql.connect(config);
    const now = new Date();
    const formattedDate = date.format(now, "YYYY-MM-DD");

    const insertResult = await sql.query(`
        INSERT INTO Workout (Name, UserID, Date)
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        VALUES ('${name}', ${user}, '${formattedDate}');`);

    const newWorkout = new Workout(
      insertResult.recordset[0].WorkoutID,
      insertResult.recordset[0].Name,
      insertResult.recordset[0].Date
    );

    await sql.close();

    return newWorkout;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function addNewUser(email, metric) {
  try {
    await sql.connect(config);

    const insertResult = await sql.query(`
        INSERT INTO Users (Email, Metric)
        OUTPUT inserted.UserID, inserted.Email, inserted.Metric
        VALUES ('${email}', ${metric});`);

    const newUser = new User(
      insertResult.recordset[0].UserID,
      insertResult.recordset[0].Email,
      insertResult.recordset[0].Metric
    );

    await sql.close();

    return newUser;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function addExercise(name, workoutID, weight = null, reps = null, distance = null) {
  if (weight === null && reps === null) {
    if (distance === null) {
      return null;
    } else {
      return addCardio(name, distance, workoutID)
    }
  } else {
    return addStrength(name, weight, reps, workoutID)
  }


}

async function addStrength(name, weight, reps, workoutID) {
  try {
    await sql.connect(config);
    const now = new Date();
    const formattedDate = date.format(now, "YYYY-MM-DD");

    const insertResult = await sql.query(`
        INSERT INTO Exercises (Name, Weight, Sets, Reps, WorkoutID, Date)
        OUTPUT inserted.ExerciseID, inserted.Name, inserted.Weight, inserted.Sets, inserted.Reps, inserted.WorkoutID, inserted.Date
        VALUES ('${name}', ${weight}, ${0}, ${reps}, ${workoutID}, '${formattedDate}');`);

    const newExercise = new Exercise(
      insertResult.recordset[0].ExerciseID,
      insertResult.recordset[0].Name,
      insertResult.recordset[0].Weight,
      insertResult.recordset[0].Sets,
      insertResult.recordset[0].Reps,
      insertResult.recordset[0].Date
    );

    await sql.close();

    return newExercise;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function addCardio(name, distance, workoutID) {
  try {
    await sql.connect(config);
    const now = new Date();
    const formattedDate = date.format(now, "YYYY-MM-DD");

    const insertResult = await sql.query(`
      INSERT INTO Cardio (Name, Distance, WorkoutID, Date)
      OUTPUT inserted.CardioID, inserted.Name, inserted.Distance, inserted.WorkoutID, inserted.Date
      VALUES ('${name}', ${distance}, ${workoutID}, '${formattedDate}');`);

    const newCardio = new Cardio(
      insertResult.recordset[0].CardioID,
      insertResult.recordset[0].Name,
      insertResult.recordset[0].Distance,
      insertResult.recordset[0].Date
    );

    await sql.close();

    return newCardio;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

module.exports = {
  getMetricUnitsForExercise,
  getMetricsForExercise,
  getWorkoutsForUser,
  getExercisesForWorkout,
  getWorkoutFromID,
  addNewWorkout,
  updateWorkoutName,
  addExercise
};
