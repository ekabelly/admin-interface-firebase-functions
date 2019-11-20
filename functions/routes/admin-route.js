const express = require('express');
const Router = express.Router();
const eventsWrap = require('../wrappers/events-wrap');
const { resHandler } = require('../middlewares/app-middlewares');
const { verifyAdmin } = require('../middlewares/auth');

Router.all(verifyAdmin);

Router.get('/event-unregister/:userId/:eventId', eventsWrap.unregisterUserFromEvent, resHandler);