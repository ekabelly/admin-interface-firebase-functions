const admin = require('firebase-admin');
const errCodes = require('../config/error-codes');
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
    if(!eventsIdArr || eventsIdArr.length < 1){
        req.err = "this user has no events of type " + req.eventsType;
        return next();
    }
    req.data = await fetchEventsByIdArr(req, eventsIdArr);
    next();
}

const fetchEvent = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref(`/events/${req.params.eventId}`));
    next();
}

const registerUserToEventConditions = (userId, event, req) => {
    if(event.assignedVolunteers.includes(userId)) {
        req.err = {
            code: errCodes.ALREADY_REGISTERED,
            message: `volunteer already registered to event.`
        };
        return false;
    }
    if(event.assignedVolunteers.length >= event.volunteers.max){
        req.err = {
            code: errCodes.EVENT_FULL,
            message: `event already full. can't register to a full events. user may register to waiting list.`
        };
        return false;
    }
    return true;
}

const addUserIdToEvent = async (userId, eventId, req) => {
    const event = await fetchSnapshot(req, db.ref(`/events/${eventId}`));
    if(event.assignedVolunteers){
        const isAllowed = registerUserToEventConditions(userId, event, req);
        if(!isAllowed){
            return false;
        }
        event.assignedVolunteers.push(userId);
    } else {
        event.assignedVolunteers = [];
        event.assignedVolunteers.push(userId);
    }
    return new Promise(resolve => db.ref(`/events/${eventId}/assignedVolunteers`)
    .set(event.assignedVolunteers).then(() => resolve(true)).catch(err => {
            req.err = err;
            resolve(false);
        }));
}

const addEventIdToUser = async (userId, eventId, req) => {
    const user = await fetchSnapshot(req, db.ref(`/users/${userId}`));
    if(user.registeredEvents){
        if(!user.registeredEvents.includes(eventId)){
            user.registeredEvents.push(eventId);
        } else {
            return false;
        }
    } else {
        user.registeredEvents = [];
        user.registeredEvents.push(eventId);
    }
    return new Promise(resolve => db.ref(`/users/${userId}/registeredEvents`)
        .set(user.registeredEvents).then(()=> resolve(true)).catch( err => {
            req.err = err;
            resolve(false);
        }));
}

const registerUserToEvent = async (req, res, next) => {
    const didRegisterUserToEvent = await addUserIdToEvent(req.params.userId, req.params.eventId, req);
    let didAddEventToUser = false;
    if(didRegisterUserToEvent){
        didAddEventToUser = await addEventIdToUser(req.params.userId, req.params.eventId, req); 
    }
    req.data = { didRegisterUserToEvent, didAddEventToUser };
    next();
}

const removeUserIdFromEvent = async (userId, eventId, req) => {
    const event = await fetchSnapshot(req, db.ref(`/events/${eventId}`));
    if(event.assignedVolunteers){
        const index = event.assignedVolunteers.indexOf(userId);
        if(index > -1){
            event.assignedVolunteers.splice(index, 1);
            return new Promise(resolve => db.ref(`/events/${eventId}/assignedVolunteers`)
                .set(event.assignedVolunteers).then(()=> resolve(true)).catch( err => {
                    req.err = err;
                    resolve(false);
                }));
        }
        req.err = {
            message: 'user not registered to that event.',
            code: errCodes.UNKNOWN_ERROR
        }
        return false;
    }
}

const removeEventIdFromUser = async (userId, eventId, req) => {
    const user = await fetchSnapshot(req, db.ref(`/users/${userId}`));
    if(user.registeredEvents){
        const index = user.registeredEvents.indexOf(eventId);
        if(index > -1){
            user.registeredEvents.splice(index, 1);
            return new Promise(resolve => db.ref(`/users/${userId}/registeredEvents`)
                .set(user.registeredEvents).then(()=> resolve(true)).catch( err => {
                    req.err = err;
                    resolve(false);
                }));
        }
        req.err = {
            message: 'user not registered to that event.',
            code: errCodes.UNKNOWN_ERROR
        }
        return false;
    }

}

const unregisterUserFromEvent = async (req, res, next) => {
    const didRemoveUserFromEvent = await removeUserIdFromEvent(req.params.userId, req.params.eventId, req);
    let didRmoveEventFromUser = false;
    if(didRemoveUserFromEvent){
        didRmoveEventFromUser = await removeEventIdFromUser(req.params.userId, req.params.eventId, req); 
    } else {
        req.err = {
            message: 'somthing went wrong.',
            code: errCodes.UNKNOWN_ERROR
        }
    }
    req.data = { didRemoveUserFromEvent, didRmoveEventFromUser };
    next();
}

const createEvent = (req, res, next) => {
    const newEvent = db.ref(`/events`).push();
    newEvent.set({ ...req.body.event, id: newEvent.key}).then(() => {
        req.data = { success: true };
        next();
    }).catch(err => {
        req.err = err;
        next();
    });
}

const updateEvent = (req, res, next) => {
    const eventToUpdate = db.ref(`/events/${req.params.eventId || req.body.updatedEvent.id}`);
    eventToUpdate.set({ ...req.body.event }).then(() => {
        req.data = { success: true };
        next();
    }).catch(err => {
        req.err = err;
        next();
    });
}



module.exports = {
    updateEvent,
    createEvent,
    fetchEvent,
    fetchEvents,
    fetchUserEvents,
    registerUserToEvent,
    unregisterUserFromEvent
}