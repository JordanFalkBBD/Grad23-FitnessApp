var sql = require("mssql");
const date = require("date-and-time");

var config = {
  user: "root",
  password: "FitnessApp",
  server: "mssqldb.cjovnczdjuek.eu-west-1.rds.amazonaws.com",
  database: "FitnessAppDB",
  trustServerCertificate: true,
};

class User {
  constructor(id, email, metric) {
    this.id = id;
    this.email = email;
    this.metric = metric;
  }
}

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

class Workout {
  constructor(id, name, date) {
    this.id = id;
    this.name = name;
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

async function fetchWorkout(user) {
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

async function fetchUser(user) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select UserID, Email, Metric from Users where UserID = ${user}`
    );

    const users = result.recordset.map((row) => {
      return new User(row.UserID, row.Email, row.Metric);
    });

    await sql.close();

    return users;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function fetchExercise(workout) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select ExerciseID, Name, Weight, Sets, Reps, Date from Exercises where WorkoutID = ${workout}`
    );

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
    console.error("Error:", error.message);
    throw error;
  }
}

async function fetchCardio(workout) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select CardioID, Name, Distance, Date from Cardio where WorkoutID = ${workout}`
    );

    const cardios = result.recordset.map((row) => {
      return new Cardio(row.CardioID, row.Name, row.Distance, row.Date);
    });

    await sql.close();

    return cardios;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function fetchUserID(email) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select UserID from Users where Email = '${email}'`
    );

    const userID = result.recordset[0].UserID;

    await sql.close();

    return userID;
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

async function updateWorkoutName(WorkoutID, newName) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
        UPDATE Workout
        SET Name = '${newName}'
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        WHERE WorkoutID = ${WorkoutID};`);

    const updateWorkout = new Workout(
      result.recordset[0].WorkoutID,
      result.recordset[0].Name,
      result.recordset[0].Date
    );

    await sql.close();

    return updateWorkout;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
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
    console.error("Error:", error.message);
    throw error;
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
      return new Cardio(
        row.CardioID,
        row.Name,
        row.Distance,
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

module.exports = {
  fetchWorkout,
  fetchUser,
  fetchExercise,
  fetchExercisesForUser,
  fetchCardio,
  fetchCardioForUser,
  fetchUserID,
  addNewWorkout,
  updateWorkoutName,
};
