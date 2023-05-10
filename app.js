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
    res.send(`Welcome ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('You have logged out!');
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