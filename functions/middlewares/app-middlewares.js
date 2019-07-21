// const admin = require('firebase-admin');

const errHandler = (req, res) => res.send({ success: false, err: req.err });

const successHandler = (req, res) => res.send({ data: req.data, success: true });

const resHandler = (req, res) => req.err ? errHandler(req, res) : successHandler(req, res);

const assignEventType = (req, next, eventsType) => {
    req.eventsType = eventsType;
    next();
}

// const isAdmin = async (req, res, next) => {
//     console.log(req.body.email);
    
//     const userRecord = await admin.auth().getUserByEmail(req.body.email);
//     if(userRecord && userRecord.email){
//         console.log('Successfully fetched user data:', userRecord.toJSON()); 
//         return next();
//     } else {
//         return res.status(401).send(error);
//     }
// }

module.exports = {
    assignEventType,
    resHandler
    // isAdmin
}