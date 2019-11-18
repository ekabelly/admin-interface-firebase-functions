
const admin = require('firebase-admin');
const { fetchSnapshot } = require('../util/app-util');
const db = admin.database();

const fetchAdmins = async req => {
    const adminsArr = await fetchSnapshot(req, db.ref('/admins'));
    return adminsArr;
}

const fetchUsersByIdArr = async (req, res, next) => {
    const promisesArr = [];
    // console.log(eventsIdArr);
    const eventsIdArr = req.body.eventsIdArr;
    for (const userId of eventsIdArr) {
        let promise = fetchSnapshot(req, db.ref(`/users/${userId}`));
        promisesArr.push(promise);
    }
    req.data = await Promise.all(promisesArr);
    return next();
}

module.exports = {
    fetchAdmins,
    fetchUsersByIdArr
}