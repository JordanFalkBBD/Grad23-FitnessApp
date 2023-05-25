var sql = require("mssql");
const date = require("date-and-time");

var config = {
    user: 'sa',
    password: 'mypassword',
    server: 'LESEDIM\\SQLEXPRESS', 
    database: 'FitnessAppDB',
    trustServerCertificate: true
};

class User{
    constructor(id, email, metric){
        this.id = id;
        this.email = email;
        this.metric = metric;
    }
}
  
class Exercise{
    constructor(id, name, weight, sets, reps, date){
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.sets = sets;
        this.reps = reps;
        this.date = date;
    }
}
  
class Workout{
    constructor(id, name, date){
        this.id = id;
        this.name = name;
        this.date = date;
    }
}

class Cardio{
    constructor(id, name, distance, date){
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.date = date; 
    }
}

async function fetchWorkouts(user) {
    try {
      await sql.connect(config);
  
      const result = await sql.query(
        `select WorkoutID, Name, UserID, Date from Workout where UserID = ${user}`
        );
  
      const workouts = result.recordset.map(row => {
        return new Workout(row.WorkoutID, row.Name, row.Date);
      });
  
      await sql.close();
  
      return workouts;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function fetchUser(user) {
    try {
      await sql.connect(config);
  
      const result = await sql.query(
        `select UserID, Email, Metric from Users where UserID = ${user}`
        );
  
      const users = result.recordset.map(row => {
        return new User(row.UserID, row.Email, row.Metric);
      });
  
      await sql.close();
  
      return users;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function fetchExercise(workout) {
    try {
      await sql.connect(config);
  
      const result = await sql.query(
        `select ExerciseID, Name, Weight, Sets, Reps, Date from Exercises where WorkoutID = ${workout}`
        );
  
      const exercises = result.recordset.map(row => {
        return new Exercise(row.ExerciseID, row.Name, row.Weight, row.Sets, row.Reps, row.Date);
      });
  
      await sql.close();
  
      return exercises;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function fetchCardio(workout) {
    try {
      await sql.connect(config);
  
      const result = await sql.query(
        `select CardioID, Name, Distance, Date from Cardio where WorkoutID = ${workout}`
        );
  
      const cardios = result.recordset.map(row => {
        return new Cardio(row.CardioID, row.Name, row.Distance, row.Date);
      });
  
      await sql.close();
  
      return cardios;
    } catch (error) {
      console.error('Error:', error.message);
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
      console.error('Error:', error.message);
      throw error;
    }
}

async function addNewWorkout(name, user) {
    try {
        await sql.connect(config);
        const now = new Date();
        const formattedDate = date.format(now, 'YYYY-MM-DD');
    
        const insertResult = await sql.query(`
        INSERT INTO Workout (Name, UserID, Date)
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        VALUES ('${name}', ${user}, '${formattedDate}');`
        );
    
        const newWorkout = new Workout(insertResult.recordset[0].WorkoutID
          , insertResult.recordset[0].Name
          , insertResult.recordset[0].Date
          );
    
        await sql.close();
    
        return newWorkout;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}

async function addNewUser(email, metric) {
    try {
        await sql.connect(config);
    
        const insertResult = await sql.query(`
        INSERT INTO Users (Email, Metric)
        OUTPUT inserted.UserID, inserted.Email, inserted.Metric
        VALUES ('${email}', ${metric});`
        );
    
        const newUser = new User(insertResult.recordset[0].UserID
          , insertResult.recordset[0].Email
          , insertResult.recordset[0].Metric
          );
    
        await sql.close();
    
        return newUser;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}

async function addNewExercise(name, weight, sets, reps, workoutID) {
    try {
        await sql.connect(config);
        const now = new Date();
        const formattedDate = date.format(now, 'YYYY-MM-DD');
    
        const insertResult = await sql.query(`
        INSERT INTO Exercises (Name, Weight, Sets, Reps, WorkoutID, Date)
        OUTPUT inserted.ExerciseID, inserted.Name, inserted.Weight, inserted.Sets, inserted.Reps, inserted.WorkoutID, inserted.Date
        VALUES ('${name}', ${weight}, ${sets}, ${reps}, ${workoutID}, '${formattedDate}');`
        );
    
        const newExercise = new Exercise(insertResult.recordset[0].ExerciseID
          , insertResult.recordset[0].Name
          , insertResult.recordset[0].Weight
          , insertResult.recordset[0].Sets
          , insertResult.recordset[0].Reps
          , insertResult.recordset[0].Date
          );
    
        await sql.close();
    
        return newExercise;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}

async function addCardio(name, distance, workoutID) {
  try {
      await sql.connect(config);
      const now = new Date();
      const formattedDate = date.format(now, 'YYYY-MM-DD');
  
      const insertResult = await sql.query(`
      INSERT INTO Cardio (Name, Distance, WorkoutID, Date)
      OUTPUT inserted.CardioID, inserted.Name, inserted.Distance, inserted.WorkoutID, inserted.Date
      VALUES ('${name}', ${distance}, ${workoutID}, '${formattedDate}');`
      );
  
      const newCardio = new Cardio(insertResult.recordset[0].CardioID
        , insertResult.recordset[0].Name
        , insertResult.recordset[0].Distance
        , insertResult.recordset[0].Date
        );
  
      await sql.close();
  
      return newCardio;
    } catch (error) {
      console.error('Error:', error.message);
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
        WHERE WorkoutID = ${WorkoutID};`
        );
    
        const updateWorkout = new Workout(result.recordset[0].WorkoutID
          , result.recordset[0].Name
          , result.recordset[0].Date
          );
    
        await sql.close();
    
        return updateWorkout;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}

async function updateWorkout(WorkoutID, newName, newDate) {
  try {
      await sql.connect(config);
  
      const result = await sql.query(`
      UPDATE Workout
      SET Name = '${newName}', Date = '${newDate}'
      OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
      WHERE WorkoutID = ${WorkoutID};`
      );
  
      const updateWorkout = new Workout(result.recordset[0].WorkoutID
        , result.recordset[0].Name
        , result.recordset[0].Date
        );
  
      await sql.close();
  
      return updateWorkout;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function updateUser(userID, newEmail, newMetric) {
  try {
      await sql.connect(config);
  
      const result = await sql.query(`
      UPDATE Users
      SET Email = '${newEmail}', Metric = '${newMetric}'
      OUTPUT inserted.UserID, inserted.Email, inserted.Metric
      WHERE UserID = ${userID};`
      );
  
      const updateUser = new User(result.recordset[0].UserID
        , result.recordset[0].Email
        , result.recordset[0].Metric
        );
  
      await sql.close();
  
      return updateUser;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function updateExercise(exerciseID, newName, newWeight, newSets, newReps, newDate) {
  try {
      await sql.connect(config);
  
      const result = await sql.query(`
      UPDATE Exercises
      SET Name = '${newName}', Weight = ${newWeight}, Sets = ${newSets}, Reps = ${newReps}, Date = '${newDate}'
      OUTPUT inserted.ExerciseID, inserted.Name, inserted.Weight, inserted.Sets, inserted.Reps, inserted.WorkoutID, inserted.Date
      WHERE ExerciseID = ${exerciseID};`
      );
  
      const updateExercise = new Exercise(result.recordset[0].ExerciseID
        , result.recordset[0].Name
        , result.recordset[0].Weight
        , result.recordset[0].Sets
        , result.recordset[0].Reps
        , result.recordset[0].Date
        );
  
      await sql.close();
  
      return updateExercise;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function updateCardio(cardioID, newName, newDistance, newDate) {
  try {
      await sql.connect(config);
  
      const result = await sql.query(`
      UPDATE Cardio
      SET Name = '${newName}', Distance = ${newDistance}, Date = '${newDate}'
      OUTPUT inserted.CardioID, inserted.Name, inserted.Distance, inserted.WorkoutID, inserted.Date
      WHERE CardioID = ${cardioID};`
      );
  
      const updateCardio= new Cardio(result.recordset[0].CardioID
        , result.recordset[0].Name
        , result.recordset[0].Distance
        , result.recordset[0].Date
        );
  
      await sql.close();
  
      return updateCardio;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

async function fetchMetric(UserID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select Metric from Users where UserID = '${UserID}'`
      );

    const metric = result.recordset[0].Metric;

    await sql.close();

    return metric;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function getWorkoutFromID(WorkoutID) {
  try {
    await sql.connect(config);

    const result = await sql.query(
      `select WorkoutID, Name, UserID, Date from Workout where WorkoutID = ${WorkoutID}`
      );

    const workout = new Workout(result.recordset[0].WorkoutID
      , result.recordset[0].Name
      , result.recordset[0].Date
      );

    await sql.close();

    return workout;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}


module.exports = {
    fetchWorkouts,
    fetchUser,
    fetchExercise,
    fetchCardio,
    fetchUserID,
    addNewWorkout,
    addNewUser,
    addNewExercise,
    addCardio,
    updateWorkoutName,
    updateWorkout,
    updateUser,
    updateExercise,
    updateCardio,
    fetchMetric,
    getWorkoutFromID,
};