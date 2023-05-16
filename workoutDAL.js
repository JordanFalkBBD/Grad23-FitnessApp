class Metric {
    constructor(id, unit, value){
        this.id = id
        this.unit = unit
        this.value = value
    }
}

class Exercise {
    constructor(id, name, metrics) {
        this.id = id
        this.name = name
        this.metrics = metrics
    }
}

class Workout {
    constructor(id, name, date) {
        this.id = id
        this.name = name
        this.date = date
    }
}


const cardio = ["cardio"]

const weights = ["olympic_weightlifting", "powerlifting", "strength"]


function getMetricUnitsForExercise(type){
    type = String(type).toLowerCase()
    if (weights.includes(type)){
        return ["kg", "reps"]
    } else if (cardio.includes(type)){
        return ["m"]
    }
    return ["None"]
}


function getMetricsForExercise(ExerciseID){
    return [new Metric(5, "reps", 10), new Metric(4, "kg", 10)]
    
}


function getExercisesForWorkout(WorkoutID) {
    // newest to oldest exercise in workout

    return {
        exercises: [
           new Exercise(
            3, "barbell lifts", getMetricsForExercise(3)
           ),
           new Exercise(
            2, "barbell lifts", getMetricsForExercise(2)
           ),
           new Exercise(
            1, "push ups", getMetricsForExercise(1)
           )
        ]
    }
}


function getWorkoutsForUser(UserID) {
    let date = new Date()
    return {
        workouts: [
            new Workout(2, "Upper Body", date),
            new Workout(1, "Legs", new Date(date.setDate(date.getDate() - 1)))
        ]
    }
}


function getWorkoutFromID(WorkoutID){
    let date = new Date()
    if (WorkoutID = 2) {
        return new Workout(2, "Upper Body", date)
    } else {
        return new Workout(1, "Legs", new Date(date.setDate(date.getDate() - 1)))
    }
}

module.exports = { getExercisesForWorkout,  getWorkoutsForUser, getWorkoutFromID, getMetricUnitsForExercise };