const admin = require('firebase-admin');

const adminLogin = async (req, res, next) => {
    const userRecord = await admin.auth().getUserByEmail(req.body.email);
    if(userRecord && userRecord.email && userRecord.uid === req.body.uid){
        console.log('Successfully fetched admin data:', userRecord.toJSON());
        // return next();
        const token = await admin.auth().createCustomToken(userRecord.uid);
        return res.send({ success: true, token });
    } else {
        return res.status(401).send({ success: false });
    }
}

const setCustomClaims = (req, res, next) => {
    const idToken = req.headers['x-access-token'];
  // Verify the ID token and decode its payload.
  return admin.auth().verifyIdToken(idToken).then((claims) => {
    // Verify user is eligible for additional privileges.
    if (typeof claims.email !== 'undefined' &&
        typeof claims.email_verified !== 'undefined' &&
        claims.email_verified) {
      // Add custom claims for additional privileges.
    return admin.auth().setCustomUserClaims(claims.sub, { admin: true })
        .then(() => {
            // Tell client to refresh token on user.
            return res.send({ success: true });
        });
    } else {
      return res.end({ success: false });
    }
  });
}

const verifyAdmin = (req, res, next) => {
    admin.auth().verifyIdToken(req.headers['x-access-token'])
    .then((decodedToken) => {
        if(decodedToken && decodedToken.admin){
            return next();
        }
        return res.status(401).send({ success: false })
    }).catch((error) => {
        console.log('invalid token', error);
        return res.send(error);
    });
}

module.exports = {
    adminLogin,
    verifyAdmin,
    setCustomClaims
}