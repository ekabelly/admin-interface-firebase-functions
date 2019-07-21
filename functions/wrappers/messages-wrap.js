const admin = require('firebase-admin');
const { fetchSnapshot } = require('../util/app-util');
const db = admin.database();

const fetchMessages = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/newsFeed'));
    next();
}

module.exports = {
    fetchMessages
}