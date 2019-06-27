const errHandler = (req, res) => res.send({ success: false, err: req.err });

const successHandler = (req, res) => res.send({ data: req.data, success: true });

const resHandler = (req, res) => req.err ? errHandler(req, res) : successHandler(req, res);

const assignEventType = (req, next, eventsType) => {
    req.eventsType = eventsType;
    next();
}

module.exports = {
    assignEventType,
    resHandler
}