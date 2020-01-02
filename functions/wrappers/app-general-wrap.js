const admin = require('firebase-admin');
const db = admin.database();
const { fetchSnapshot } = require('../util/app-util');

const fetchConfig = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/config'));
    next();
}

const fetchTags = async (req, res, next) => {
    req.data = await fetchSnapshot(req, db.ref('/config/tags'));
    next();
}

const removeTag = async (req, res, next) => {
    if(req.data && req.data[req.params.tagId]){
        delete req.data[req.params.tagId];
        const tags = req.data;
        await db.ref('/config/tags').set(tags).catch( err => {
            req.err = err;
        });
        req.data = { success: true };
    } else {
        req.err = {
            message: 'tag not found',
            code: 'TAG_NOT_FOUND'
        }
    }
    next()
}

module.exports = {
    fetchConfig,
    fetchTags,
    removeTag
}