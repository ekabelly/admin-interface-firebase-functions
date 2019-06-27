const app = require('express')();
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const userRoutes = require('./routes/users-routes');
const { resHandler, assignEventType } = require('./middlewares/app-middlewares');

app.get('/events/', userRoutes.fetchEvents, resHandler);
app.get('/events/:first/:last', userRoutes.fetchEvents, resHandler);
app.get('/event/:eventId', userRoutes.fetchEvent, resHandler);
app.get('/user-registered-events/:userId', (req, res, next)=> assignEventType(req, next, 'registeredEvents'), 
    userRoutes.fetchUserEvents, resHandler);
app.get('/user-past-events/:userId', (req, res, next)=> assignEventType(req, next, 'pastEvents'), 
    userRoutes.fetchUserEvents, resHandler);
app.get('/saved-events/:userId', (req, res, next)=> assignEventType(req, next, 'savedEvents'), 
    userRoutes.fetchUserEvents, resHandler);

app.get('/messages/', userRoutes.fetchMessages, resHandler);
app.get('/messages/:first/:last', userRoutes.fetchMessages, resHandler);


exports.api = functions.https.onRequest(app);





// const methodsHandler = require('./middlewares/methods-handler');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.fetchEvents = functions.https.onRequest(methodsHandler.get, async (req, res) => {
//     const { min, max } = req.query;
//     console.log(min, max);
    
//     const snapshot = await db.ref('/events').once('value');
//     return res.send({ events: snapshot.val(), success: true });
// })
// app.get('/admins', async (req, res) => {
//     const snapshot = await db.ref('/admins').once('value');
//     return res.send({ events: snapshot.val(), success: true });
// })
// exports.admins = functions.https.onRequest(app);