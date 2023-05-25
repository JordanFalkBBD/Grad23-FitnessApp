var sql = require("mssql");
const date = require("date-and-time");
const passport = require("passport");

var config = {
  user: 'root',
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
    return ["km"];
  }
  return ["None"];
}

async function getWorkoutsForUser(user) {
  try {
    await sql.connect(config);
    const result = await sql.query(
      `select * from dbo.Workout where UserID = ${user}`
    );

    const workouts = result.recordset.map((row) => new Workout(row.WorkoutID, row.Name, row.DateCreated));

    await sql.close();

    return workouts;
  } catch (error) {
    console.error("getWorkoutsForUser");
  }
}

async function getWorkoutFromID(WorkoutID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select * from Workout where 'WorkoutID' = ${WorkoutID}`
    );

    const workout = result.recordset.map((row) => {
      return new Workout(row.WorkoutID, row.Name, row.DateCreated);
    })[0];

    await sql.close();

    return workout;
  } catch (error) {
    console.error("getWorkoutFromID", error);
  }
}

async function getMetricsForExercise(exerciseID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select Weight Reps from Exercises where ExerciseID = ${exerciseID}`
    );

    const exercises = result.recordset.map((row) => {
      return [
        new Metric(row.Weight, "kg"),
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
          new Metric(row.Distance, "km")
        ]
      }
      );

      await sql.close();

      return exercises;
    } catch (error) {

      console.error("getMetricsForExercise");
    }
  }
}

async function getExercisesForWorkout(workoutID) {
  try {
    await sql.connect(config);

    const strength = await sql.query(
      `select * from Exercises where WorkoutID = ${workoutID}`
    );

    await sql.connect(config);

    const cardio = await sql.query(
      `select * from Cardio where WorkoutID = ${workoutID}`
    );

    let exercises = []
    if (strength.recordset.length > 0) {
      exercises = [...exercises, ...strength.recordset.map((row) => {
        return new Exercise(
          row.ExerciseID,
          row.Name,
          [
            new Metric("kg", row.Weight),
            new Metric("Reps", row.Reps)
          ]
        );
      })]
    }

    if (cardio.recordset.length > 0) {
      exercises = [...exercises, ...cardio.recordset.map((row) => {
        return new Exercise(
          row.CardioID,
          row.Name,
          [
            new Metric("km", row.Distance)
          ]
        );
      })];
    }

    await sql.close();

    console.log(exercises)

    return exercises;
  } catch (error) {
    console.error("getExercisesForWorkout", error);
  }
}

async function addNewWorkout(UserID) {
  try {
    await sql.connect(config);
    const now = new Date();
    const formattedDate = date.format(now, "YYYY-MM-DD");

    console.log("USER ID IN ADD NEW WORKOUT: " + UserID)

    const insertResult = await sql.query(`
        INSERT INTO dbo.Workout (Name, UserID, DateCreated)
        OUTPUT inserted.WorkoutID
        VALUES ('New Workout', ${UserID}, '${formattedDate}');`);

    const newWorkout = new Workout(
      insertResult.recordset[0].WorkoutID,
      'New Workout',
      now
    );

    await sql.close();

    return newWorkout;
  } catch (error) {
    console.error("addNewWorkout");
  }
}

async function updateWorkoutName(WorkoutID, newName) {
  try {
    await sql.connect(config);
    
    console.log("New name = " + newName);


    const result = await sql.query(`
        UPDATE Workout
        SET Name = "${newName}"
        WHERE WorkoutID = ${WorkoutID};`);

    await sql.close();

  } catch (error) {
    console.error("updateWorkoutName", error);
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
  console.error("EXERCISE NOT ADDED")

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
    console.error("addStrength", error);
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
    console.error("addCardio", error);
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
