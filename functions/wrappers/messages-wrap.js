const admin = require('firebase-admin');
const { fetchSnapshot } = require('../util/app-util');
const { errHandler } = require('../middlewares/app-middlewares');
const db = admin.database();

const fetchMessages = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/newsFeed'));
    next();
}

const fetchMessage = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref(`/newsFeed/${req.params.messageId}`));
    next();
}

const createMessage = async (req, res, next) => {
    const message = db.ref('/newsFeed').push();
    req.body.message.id = message.key;
    message.set(req.body.message).then(() => {
        req.data = { success: true };
        return next();
    }).catch(errHandler);
}

const updateMessage = (req, res, next) => {
    const messageToUpdate = db.ref(`/newsFeed/${req.params.messageId}`);
    messageToUpdate.set(req.body.message).then(() => {
        req.data = { success: true };
        return next();
    }).catch(errHandler);
}

const deleteMessage =(req, res, next) => {
    const messageToDelete = db.ref(`/newsFeed/${req.params.messageId}`);
    messageToDelete.remove().then(() => {
        req.data = { success: true };
        return next();
    }).catch(errHandler);
}

module.exports = {
    fetchMessages,
    fetchMessage,
    createMessage,
    updateMessage,
    deleteMessage
}