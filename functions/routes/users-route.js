const Router = require('express').Router();
const { adminLogin, setCustomClaims } = require('../middlewares/auth');

Router.post('/admin', adminLogin);

Router.get('/set-custom-claims', setCustomClaims);

module.exports = Router;