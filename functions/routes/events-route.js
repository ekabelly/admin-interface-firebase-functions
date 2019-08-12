const express = require('express');
const Router = express.Router();
const eventsWrap = require('../wrappers/events-wrap');
const { resHandler, assignEventType } = require('../middlewares/app-middlewares');
// const { verifyAdmin } = require('../middlewares/auth');

// Router.all('*', verifyAdmin);

Router.get('/', eventsWrap.fetchEvents, resHandler);

Router.get('paging/:first/:last', eventsWrap.fetchEvents, resHandler);

Router.get('/event/:eventId', eventsWrap.fetchEvent, resHandler);

Router.get('/user-registered-events/:userId', (req, res, next)=> assignEventType(req, next, 'registeredEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/user-past-events/:userId', (req, res, next)=> assignEventType(req, next, 'pastEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/saved-events/:userId', (req, res, next)=> assignEventType(req, next, 'savedEvents'), 
    eventsWrap.fetchUserEvents, resHandler);

Router.get('/event-register/:userId/:eventId', eventsWrap.registerUserToEvent, resHandler);

// Router.get('/messages/', userRoutes.fetchMessages, resHandler);

// Router.get('/messages/:first/:last', userRoutes.fetchMessages, resHandler);

module.exports = Router;