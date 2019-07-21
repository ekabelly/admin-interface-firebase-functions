const Router = require('express').Router();
const messagesWrap = require('../wrappers/messages-wrap');
const { resHandler } = require('../middlewares/app-middlewares');

Router.get('/', messagesWrap.fetchMessages, resHandler);

Router.get('/:first/:last', messagesWrap.fetchMessages, resHandler);

module.exports = Router;