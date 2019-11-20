const admin = require('firebase-admin');
const db = admin.database();
const { fetchSnapshot } = require('../util/app-util');

const fetchConfig = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/config'));
    next();
}

module.exports = {
    fetchConfig
}