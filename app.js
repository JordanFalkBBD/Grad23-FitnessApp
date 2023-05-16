const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const passport = require('passport');
const dal = require('./workoutDAL');
require('./auth');
const date = require('date-and-time')

//TODO: Extract this function to a separate file
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();

// TODO: Add SESSION_SECRET to process.env
const SESSION_SECRET = 'secret';
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true, currentWorkout: undefined, userID: 1 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '\\public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});


app.get('/workout/next', async function (req, res) {
    // Retrieve the tag from our URL path
    let workouts = dal.getWorkoutsForUser(session.get("userID")).workouts

    current = session.get("currentWorkout")

    for (let i = 1; i < workouts.length; i++) {
        if (workouts[i].id == current) {
            session.set("currentWorkout", workouts[i - 1].id)
        }
    }

    res.redirect("/workout")
});

app.get('/workout/prev', async function (req, res) {
    // Retrieve the tag from our URL path
    let workouts = dal.getWorkoutsForUser(session.get("userID")).workouts

    current = session.get("currentWorkout")

    for (let i = workouts.length; i > 1; i++) {
        if (workouts[i].id == current) {
            session.set("currentWorkout", workouts[i + 1].id)
        }
    }

    res.redirect("/workout")
});


app.get('/workout', isLoggedIn, (req, res) => {
    let workouts = dal.getWorkoutsForUser(0).workouts

    let workout = undefined
    if (session.get("currentWorkout") === undefined) {
        workout = workouts[0]
        session.set("currentWorkout", workout.id)
    } else {
        workout = dal.getWorkoutFromID(session.get(currentWorkout))
    }


    workout.date = date.format(workout.date, "dddd, D MMM")
    let exercises = dal.getExercisesForWorkout(workout.id).exercises
    let grouped_exercises = {}

    for (let exercise of exercises) {
        if (!(exercise.name in grouped_exercises)) {
            grouped_exercises[exercise.name] = []
        }

        let exercise_group = grouped_exercises[exercise.name]

        let set = {
            number: exercises.filter(x => x.name == exercise.name).length - exercise_group.length,
            metrics: exercise.metrics
        }

        exercise_group.push(set)
        grouped_exercises[exercise.name] = exercise_group
    }

    let user = req.user.displayName

    res.render('workoutPage', {
        workout: workout,
        exercises: grouped_exercises,
        user: user
    });

});

app.use(express.static(__dirname + '/static'));

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            res.send('An error occurred while logging you out.');
        } else {
            req.session.destroy();
            res.send('<p>You have logged out!</p> <a href="/">Go to home</a>');
        }
    });
});


// Google authentication routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/workout',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('auth/google/failure', (req, res) => {
    res.send('Something went wrong with Google authentication');
});

app.post("/add_exercise", (req, res) => {
    res.status(200)
    res.end()
})

// Start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});