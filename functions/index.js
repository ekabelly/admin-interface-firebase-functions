require('./config/firebase-config').initApp();
const app = require('express')();
const cors = require('cors');
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

app.use(cors());

// Function URL (api): https://us-central1-admin-interface-dev.cloudfunctions.net/api

app.use('/login', require('./routes/users-route'));

app.use('/events', require('./routes/events-route'));

app.use('/messages', require('./routes/messages-route'));

exports.api = functions.https.onRequest(app);