const serviceAccount = require('../config/admin-interface-dev-33d2e3b70572.json');
const admin = require('firebase-admin');

const initApp = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com/`
    });
}

module.exports = {
    initApp
}