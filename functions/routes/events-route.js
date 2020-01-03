const express = require('express');
const Router = express.Router();
const eventsWrap = require('../wrappers/events-wrap');
const { resHandler, assignEventType, verifyParams } = require('../middlewares/app-middlewares');
const { verifyAdmin } = require('../middlewares/auth');

Router.get('/', eventsWrap.fetchEvents, resHandler);

Router.get('paging/:first/:last', eventsWrap.fetchEvents, resHandler);

Router.get('/event/:eventId', verifyParams, eventsWrap.fetchEvent, resHandler);

Router.get('/user-registered-events/:userId', verifyParams, (req, res, next)=> assignEventType(req, next, 'registeredEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/user-past-events/:userId', verifyParams, (req, res, next)=> assignEventType(req, next, 'pastEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/saved-events/:userId', verifyParams, (req, res, next)=> assignEventType(req, next, 'savedEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/toggle-saved-event/:userId/:eventId', verifyParams, eventsWrap.addEventToUserSavedEvents, resHandler);

Router.get('/event-register/:userId/:eventId', verifyParams, eventsWrap.registerUserToEvent, resHandler);

Router.get('/event-unregister/:userId/:eventId', verifyParams, eventsWrap.unregisterUserFromEvent, resHandler);

Router.get('/event-unregister-backup/:userId/:eventId', verifyParams, eventsWrap.unregisterUserFromEventBackup, resHandler);

Router.get('/event-assign-from-backup/:userId/:eventId', verifyParams, eventsWrap.unregisterUserFromEventBackup, eventsWrap.registerUserToEvent, resHandler);

Router.get('/event-reassign-to-backup/:userId/:eventId', verifyParams, eventsWrap.unregisterUserFromEvent, eventsWrap.assignUserToBackup, resHandler);

Router.get('/finish-event/:eventId', verifyParams, eventsWrap.finishEvent, resHandler);

Router.all('*', verifyAdmin);

Router.post('/create', eventsWrap.createEvent, resHandler);

Router.put('/update/:eventId', verifyParams, eventsWrap.updateEvent, resHandler);

module.exports = Router;