// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const { errHandler } = require('../middlewares/app-middlewares')
const { errors } = require('../config/config');
const serviceAccount = require('../config/admin-interface-dev-33d2e3b70572.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com/`
});
const db = admin.database();

// this is a generic function, with will receive dbRef (for example, admin.database().ref('/events/1'))
// and return type Any. also, must be given (express) req.
const fetchSnapshot = async (req, dbRef) => {
    let { first, last } = req.params;
    first = Number(first);
    console.log(`first: ${first}, last: ${last}`);
    let snapshot;
    if(!first && !last){
        snapshot = await dbRef.once('value');
        return snapshot.val();
    }
    if(first > 0 && first < Number(last)){
        snapshot = await dbRef.orderByKey().limitToFirst(first).startAt(last).once('value');
        return snapshot.val();
    }
    if(!snapshot){
        req.err = errors.INVALID_PARAMS;
    }
}

const fetchEventsByIdArr = async (req, eventsIdArr) => {
    const promisesArr = [];
    console.log(eventsIdArr);
    for (const eventId of eventsIdArr) {
        let promise = fetchSnapshot(req, db.ref(`/events/${eventId}`));
        promisesArr.push(promise);
    }
    const eventsArr = await Promise.all(promisesArr);
    return eventsArr;
}

const fetchEvents = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/events'));
    next();
}

const fetchUserEvents = async (req, res, next) => {
    const eventsIdArr = await fetchSnapshot(req, db.ref(`/users/${req.params.userId}/${req.eventsType /* this is registeredEvents, pastEvents or savedEvents */}`));
    req.data = await fetchEventsByIdArr(req, eventsIdArr);
    next();
}

const fetchEvent = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref(`/events/${req.params.eventId}`));
    next();
}

const fetchMessages = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/newsFeed'));
    next();
}

module.exports = {
    fetchEvent,
    fetchEvents,
    fetchUserEvents,
    fetchMessages
}