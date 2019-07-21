const admin = require('firebase-admin');
const { fetchSnapshot } = require('../util/app-util');
const db = admin.database();

const fetchEventsByIdArr = async (req, eventsIdArr) => {
    const promisesArr = [];
    // console.log(eventsIdArr);
    for (const eventId of eventsIdArr) {
        let promise = fetchSnapshot(req, db.ref(`/events/${eventId}`));
        promisesArr.push(promise);
    }
    const eventsArr = await Promise.all(promisesArr);
    return eventsArr;
}

const fetchEvents = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/events'));
    return next();
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

const registerUserToEvent = async (req, res, next) => {
    const promises = []
    // const registeredUserToEventsPromise = registerUserToEvent();
    // const addRegisteredEventToUserPromise = addRegisteredEventToUser(); 
    req.data = await Promise.all(promises)
    next();
}

// const fetchMessages = async (req, res, next) => {
//     req.data = await fetchSnapshot(req, db.ref('/newsFeed'));
//     next();
// }

module.exports = {
    fetchEvent,
    fetchEvents,
    fetchUserEvents,
    registerUserToEvent
}