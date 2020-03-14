require('./config/firebase-config').initApp();
const app = require('express')();
const cors = require('cors');
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const { errHandler } = require('./middlewares/app-middlewares');

app.use(cors());

// Function URL (api): https://us-central1-admin-interface-dev.cloudfunctions.net/api

app.use('/login', require('./routes/login-route'));

app.use('/users', require('./routes/users-route'));

app.use('/events', require('./routes/events-route'));

app.use('/messages', require('./routes/messages-route'));

app.use('/general-services', require('./routes/app-general-route'));

app.use((err, req, res) => {
    req.err = err;
    return errHandler(req, res);
});

exports.api = functions.https.onRequest(app);