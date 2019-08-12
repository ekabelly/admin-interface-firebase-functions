
const admin = require('firebase-admin');
const { fetchSnapshot } = require('../util/app-util');
const db = admin.database();

const fecthAdmins = async req => {
    const adminsArr = await fetchSnapshot(req, db.ref('/admins'));
    return adminsArr;
}

module.exports = {
    fecthAdmins
}