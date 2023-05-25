var sql = require("mssql");
const date = require("date-and-time");

var config = {
    user: 'root',
    password: "FitnessApp",
    server: "mssqldb.cjovnczdjuek.eu-west-1.rds.amazonaws.com",
    database: "FitnessAppDB",
    trustServerCertificate: true,
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

      const query = `select WorkoutID, Name, UserID, Date from Workout where UserID = @userid`;
      const request = new sql.Request();
      request.input('userid', sql.Int, user);
  
      const result = await request.query(query);

      const workouts = result.recordset.map(row => {
        return new Workout(row.WorkoutID, row.Name, row.Date);
      });
  
      await sql.close();
  
      return workouts;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function fetchUser(user) {
    try {
      await sql.connect(config);

      const query = `select UserID, Email, Metric from Users where UserID = @userid`;
      const request = new sql.Request();
      request.input('userid', sql.Int, user);
  
      const result = await request.query(query);
  
      const users = result.recordset.map(row => {
        return new User(row.UserID, row.Email, row.Metric);
      });
  
      await sql.close();
  
      return users;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function fetchExercise(workout) {
    try {
      await sql.connect(config);

      const query = `select ExerciseID, Name, Weight, Sets, Reps, Date from Exercises where WorkoutID = @workoutid`;
      const request = new sql.Request();
      request.input('workoutid', sql.Int, workout);
  
      const result = await request.query(query);
  
      const exercises = result.recordset.map(row => {
        return new Exercise(row.ExerciseID, row.Name, row.Weight, row.Sets, row.Reps, row.Date);
      });
  
      await sql.close();
  
      return exercises;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function fetchCardio(workout) {
    try {
      await sql.connect(config);

      const query = `select CardioID, Name, Distance, Date from Cardio where WorkoutID = @workoutid`;
      const request = new sql.Request();
      request.input('workoutid', sql.Int, workout);
  
      const result = await request.query(query);
  
      const cardios = result.recordset.map(row => {
        return new Cardio(row.CardioID, row.Name, row.Distance, row.Date);
      });
  
      await sql.close();
  
      return cardios;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function fetchUserID(email) {
    try {
      await sql.connect(config);
      console.log(email);

      const query = `select UserID from Users where Email = @email`;
      const request = new sql.Request();
      request.input('email', sql.VarChar, email);
  
      const result = await request.query(query);
      console.log(result);
  
      const userID = result.recordset[0].UserID;
  
      await sql.close();
  
      return userID;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function addNewWorkout(name, user) {
    try {
        await sql.connect(config);

        const now = new Date();
        const formattedDate = date.format(now, 'YYYY-MM-DD');

        const query = `INSERT INTO Workout (Name, UserID, Date)
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        VALUES (@name, @userid, @date);`;
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('userid', sql.Int, user);
        request.input('date', sql.Date, formattedDate);
    
        const insertResult = await request.query(query);
    
        const newWorkout = new Workout(insertResult.recordset[0].WorkoutID
          , insertResult.recordset[0].Name
          , insertResult.recordset[0].Date
          );
    
        await sql.close();
    
        return newWorkout;
      } catch (error) {
        console.error('Error:', error.message);
        return;
      }
}

async function addNewUser(email, metric) {
    try {
        await sql.connect(config);

        const query = `INSERT INTO Users (Email, Metric)
        OUTPUT inserted.UserID, inserted.Email, inserted.Metric
        VALUES (@email, @metric);`;
        const request = new sql.Request();
        request.input('email', sql.VarChar, email);
        request.input('metric', sql.Bit, metric);
    
        const insertResult = await request.query(query);
    
        const newUser = new User(insertResult.recordset[0].UserID
          , insertResult.recordset[0].Email
          , insertResult.recordset[0].Metric
          );
    
        await sql.close();
    
        return newUser;
      } catch (error) {
        console.error('Error:', error.message);
        return;
      }
}

async function addNewExercise(name, weight, sets, reps, workoutID) {
    try {
        await sql.connect(config);

        const now = new Date();
        const formattedDate = date.format(now, 'YYYY-MM-DD');

        const query = `INSERT INTO Exercises (Name, Weight, Sets, Reps, WorkoutID, Date)
        OUTPUT inserted.ExerciseID, inserted.Name, inserted.Weight, inserted.Sets, inserted.Reps, inserted.WorkoutID, inserted.Date
        VALUES (@name, @weight, @sets, @reps, @workoutid, @date);`;
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('weight', sql.Int, weight);
        request.input('sets', sql.Int, sets);
        request.input('reps', sql.Int, reps);
        request.input('workoutid', sql.Int, workoutID);
        request.input('date', sql.Date, formattedDate);
    
        const insertResult = await request.query(query);
    
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
        return;
      }
}

async function addCardio(name, distance, workoutID) {
  try {
      await sql.connect(config);

      const now = new Date();
      const formattedDate = date.format(now, 'YYYY-MM-DD');

      const query = `INSERT INTO Cardio (Name, Distance, WorkoutID, Date)
      OUTPUT inserted.CardioID, inserted.Name, inserted.Distance, inserted.WorkoutID, inserted.Date
      VALUES (@name, @distance, @workoutid, @date);`;
      const request = new sql.Request();
      request.input('name', sql.VarChar, name);
      request.input('distance', sql.Int, distance);
      request.input('workoutid', sql.Int, workoutID);
      request.input('date', sql.Date, formattedDate);
  
      const insertResult = await request.query(query);
  
      const newCardio = new Cardio(insertResult.recordset[0].CardioID
        , insertResult.recordset[0].Name
        , insertResult.recordset[0].Distance
        , insertResult.recordset[0].Date
        );
  
      await sql.close();
  
      return newCardio;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function updateWorkoutName(WorkoutID, newName) {
    try {
        await sql.connect(config);

        const query = `UPDATE Workout
        SET Name = @name
        OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
        WHERE WorkoutID = @workoutid;`;
        const request = new sql.Request();
        request.input('name', sql.VarChar, newName);
        request.input('workoutid', sql.Int, WorkoutID);
    
        const result = await request.query(query);
    
        const updateWorkout = new Workout(result.recordset[0].WorkoutID
          , result.recordset[0].Name
          , result.recordset[0].Date
          );
    
        await sql.close();
    
        return updateWorkout;
      } catch (error) {
        console.error('Error:', error.message);
        return;
      }
}

async function updateWorkout(WorkoutID, newName, newDate) {
  try {
      await sql.connect(config);

      const query = `UPDATE Workout
      SET Name = @name, Date = @date
      OUTPUT inserted.WorkoutID, inserted.Name, inserted.Date
      WHERE WorkoutID = @workoutid;`;
      const request = new sql.Request();
      request.input('name', sql.VarChar, newName);
      request.input('date', sql.Date, newDate);
      request.input('workoutid', sql.Int, WorkoutID);
  
      const result = await request.query(query);
  
      const updateWorkout = new Workout(result.recordset[0].WorkoutID
        , result.recordset[0].Name
        , result.recordset[0].Date
        );
  
      await sql.close();
  
      return updateWorkout;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function updateUser(userID, newEmail, newMetric) {
  try {
      await sql.connect(config);

      const query = `UPDATE Users
      SET Email = @email, Metric = @metric
      OUTPUT inserted.UserID, inserted.Email, inserted.Metric
      WHERE UserID = @userid;`;
      const request = new sql.Request();
      request.input('email', sql.VarChar, newEmail);
      request.input('metric', sql.Bit, newMetric);
      request.input('userid', sql.Int, userID);
  
      const result = await request.query(query);
  
      const updateUser = new User(result.recordset[0].UserID
        , result.recordset[0].Email
        , result.recordset[0].Metric
        );
  
      await sql.close();
  
      return updateUser;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function updateExercise(exerciseID, newName, newWeight, newSets, newReps, newDate) {
  try {
      await sql.connect(config);

      const query = `UPDATE Exercises
      SET Name = @name, Weight = @weight, Sets = @sets, Reps = @reps, Date = @date
      OUTPUT inserted.ExerciseID, inserted.Name, inserted.Weight, inserted.Sets, inserted.Reps, inserted.WorkoutID, inserted.Date
      WHERE ExerciseID = @exerciseid;`;
      const request = new sql.Request();
      request.input('name', sql.VarChar, newName);
      request.input('weight', sql.Int, newWeight);
      request.input('sets', sql.Int, newSets);
      request.input('reps', sql.Int, newReps);
      request.input('exerciseid', sql.Int, exerciseID);
      request.input('date', sql.Date, newDate);
  
      const result = await request.query(query);
  
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
      return;
    }
}

async function updateCardio(cardioID, newName, newDistance, newDate) {
  try {
      await sql.connect(config);

      const query = `UPDATE Cardio
      SET Name = @name, Distance = @distance, Date = @date
      OUTPUT inserted.CardioID, inserted.Name, inserted.Distance, inserted.WorkoutID, inserted.Date
      WHERE CardioID = @cardioid;`;
      const request = new sql.Request();
      request.input('name', sql.VarChar, newName);
      request.input('distance', sql.Int, newDistance);
      request.input('cardioid', sql.Int, cardioID);
      request.input('date', sql.Date, newDate);
  
      const result = await request.query(query);
  
      const updateCardio= new Cardio(result.recordset[0].CardioID
        , result.recordset[0].Name
        , result.recordset[0].Distance
        , result.recordset[0].Date
        );
  
      await sql.close();
  
      return updateCardio;
    } catch (error) {
      console.error('Error:', error.message);
      return;
    }
}

async function fetchMetric(UserID) {
  try {
    await sql.connect(config);

    const query = `select Metric from Users where UserID = @userid`;
    const request = new sql.Request();
    request.input('userid', sql.Int, UserID);

    const result = await request.query(query);

    const metric = result.recordset[0].Metric;

    await sql.close();

    return metric;
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }
}

async function getWorkoutFromID(WorkoutID) {
  try {
    await sql.connect(config);

    const query = `select WorkoutID, Name, UserID, Date from Workout where WorkoutID = @workoutid`;
    const request = new sql.Request();
    request.input('workoutid', sql.Int, WorkoutID);

    const result = await request.query(query);

    const workout = new Workout(result.recordset[0].WorkoutID
      , result.recordset[0].Name
      , result.recordset[0].Date
      );

    await sql.close();

    return workout;
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }
}

async function fetchExercisesForUser(userID) {
  try {
    await sql.connect(config);

    const query = `select Exercises.ExerciseID, Exercises.Name, Exercises.Weight, Exercises.Sets, Exercises.Reps, Exercises.Date 
    from Exercises 
    left outer join Workout on Exercises.WorkoutID = Workout.WorkoutID
    where Workout.UserID = @userid`;
    const request = new sql.Request();
    request.input('userid', sql.Int, userID);

    const result = await request.query(query);

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
    return;
  }
}

async function fetchCardioForUser(userID) {
  try {
    await sql.connect(config);

    const query = `select Cardio.CardioID, Cardio.Name, Cardio.Distance, Cardio.Date 
    from Cardio
    left outer join Workout on Cardio.WorkoutID = Workout.WorkoutID
    where Workout.UserID = @userid`;
    const request = new sql.Request();
    request.input('userid', sql.Int, userID);

    const result = await request.query(query);

    const exercises = result.recordset.map((row) => {
      return new Cardio(row.CardioID, row.Name, row.Distance, row.Date);
    });

    await sql.close();

    return exercises;
  } catch (error) {
    console.error("Error:", error.message);
    return;
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
    fetchExercisesForUser,
    fetchCardioForUser,
};