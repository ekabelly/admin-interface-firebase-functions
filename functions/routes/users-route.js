const Router = require('express').Router();
const usersWrap = require('../wrappers/users-wrap');
const { resHandler, handleNullData } = require('../middlewares/app-middlewares');

Router.post('/', usersWrap.fetchUsersByIdArr, resHandler);

module.exports = Router;