// const serviceAccount = require('.//service-account.json');
const serviceAccount = require('./admin-interface-dev-d6ef17d77f73.json');
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