// const admin = require('firebase-admin');

const errHandler = (req, res) => res.status(500).send({ success: false, err: req.err });

const successHandler = (req, res) => res.send({ data: req.data, success: true });

const resHandler = (req, res) => req.err ? errHandler(req, res) : successHandler(req, res);


// this function is used to pass to fetchUserEvents the event type it has to fetch.
const assignEventType = (req, next, eventsType) => {
    req.eventsType = eventsType;
    next();
}

module.exports = {
    assignEventType,
    resHandler
}