const Router = require('express').Router();
const usersWrap = require('../wrappers/users-wrap');
const { resHandler } = require('../middlewares/app-middlewares');

Router.get('/', usersWrap.fetchUsersByIdArr, resHandler);

module.exports = Router;