const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

//TODO: Extract this function to a separate file
function isLoggedIn(req, res, next) {
    req.user? next() : res.sendStatus(401);
}

const app = express();

// TODO: Add SESSION_SECRET to process.env
const SESSION_SECRET = 'secret';
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/static/workoutPage.html');
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/workout', isLoggedIn, (req, res) => {
    res.send(`<p>Welcome ${req.user.displayName}</p> <a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
    req.logout(function(err) {
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
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
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

// Start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});