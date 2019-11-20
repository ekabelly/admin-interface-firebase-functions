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

const assignEntityToReq = async (req, entityName, id) => {
    const entity = await fetchSnapshot(req, db.ref(`/${entityName}s/${id}`));
    if(!entity){
        req.err = {
            code: errCodes.INVALID_PARAMS,
            message: `${entityName} not found.`
        };
        return false;
    }
    req[entityName] = entity;
}

// const removeItemFromArrOrObj = (arrOrObj, key) => {
//     if(arrOrObj.constructor === Object){
//         delete arrOrObj[key];
//     }
//     if(arrOrObj.constructor === Array){
//         arrOrObj.splice(1, key);
//     }
//     return arrOrObj;
// }


// const sanitizeNullData = data => {
//     for (const key in data) {
//         if(!data[key] && data[key] !== false){
//             data = removeItemFromArrOrObj(data, key);
//         } else if(data[key].constructor === Object ||  data[key].constructor === Array){
//             data[key] = sanitizeNullData(data[key]);
//         }
//     }
//     return data;
// }

module.exports = {
    fetchSnapshot
    // sanitizeNullData
}