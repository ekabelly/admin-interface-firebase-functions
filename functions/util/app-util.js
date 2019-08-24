const errCodes = require('../config/error-codes');

// this is a generic function, with will receive dbRef (for example, admin.database().ref('/events/1'))
// and return type Any. also, must be given (express) req.
const fetchSnapshot = async (req, dbRef) => {
    let { first, last } = req.params;
    first = Number(first);
    console.log(`first: ${first}, last: ${last}`);
    let snapshot;
    if(!first && !last){
        snapshot = await dbRef.once('value');
        return snapshot.val();
    }
    if(first > 0 && first < Number(last)){
        snapshot = await dbRef.orderByKey().limitToFirst(first).startAt(last).once('value');
        return snapshot.val();
    }
    if(!snapshot){
        req.err = {
            message: 'first and last must be valid numbers.',
            code: errCodes.INVALID_PARAMS
        };
    }
}

module.exports = {
    fetchSnapshot
}