class Metric {
    constructor(id, unit, value){
        this.id = id
        this.unit = unit
        this.value = value
    }
}

class Exercise {
    constructor(id, name, ...metrics) {
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


function getExercisesForWorkout(WorkoutID) {
    // newest to oldest exercise in workout
    return {
        exercises: [
           new Exercise(
            3, "barbell lifts", new Metric(5, "reps", 10), new Metric(4, "weight (kg)", 10)
           ),
           new Exercise(
            2, "barbell lifts", new Metric(3, "reps", 10), new Metric(2, "weight (kg)", 15)
           ),
           new Exercise(
            1, "push ups", new Metric(1, "reps", 15)
           )
        ]
    }
}


function getWorkoutsForUser(UserID) {
    let date = new Date()
    return {
        workouts: [
            new Workout(2, "Upper Body", date),
            new Workout(1, "Legs", date.setDate(date.getDate() - 1))
        ]
    }
}


module.exports = { getExercisesForWorkout,  getWorkoutsForUser };