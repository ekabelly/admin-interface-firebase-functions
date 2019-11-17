const express = require('express');
const Router = express.Router();
const eventsWrap = require('../wrappers/events-wrap');
const { resHandler, assignEventType } = require('../middlewares/app-middlewares');
// const { verifyAdmin } = require('../middlewares/auth');

// Router.all('*', verifyAdmin);

Router.get('/', eventsWrap.fetchEvents, resHandler);

Router.get('paging/:first/:last', eventsWrap.fetchEvents, resHandler);

Router.post('/create', eventsWrap.createEvent, resHandler);

Router.put('/update/:eventId', eventsWrap.updateEvent, resHandler);

Router.get('/event/:eventId', eventsWrap.fetchEvent, resHandler);

Router.get('/user-registered-events/:userId', (req, res, next)=> assignEventType(req, next, 'registeredEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/user-past-events/:userId', (req, res, next)=> assignEventType(req, next, 'pastEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/saved-events/:userId', (req, res, next)=> assignEventType(req, next, 'savedEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/toggle-saved-event/:userId/:eventId', eventsWrap.addEventToUserSavedEvents, resHandler);

Router.get('/event-register/:userId/:eventId', eventsWrap.registerUserToEvent, resHandler);

Router.get('/event-unregister/:userId/:eventId', eventsWrap.unregisterUserFromEvent, resHandler);

Router.get('/finish-event/:eventId', eventsWrap.finishEvent, resHandler);

module.exports = Router;