const Router = require('express').Router();
const messagesWrap = require('../wrappers/messages-wrap');
const { resHandler, verifyParams } = require('../middlewares/app-middlewares');
const { verifyAdmin } = require('../middlewares/auth');

Router.get('/', messagesWrap.fetchMessages, resHandler);

Router.get('/:messageId', messagesWrap.fetchMessage, resHandler);

Router.get('/paging/:first/:last', messagesWrap.fetchMessages, resHandler);

Router.all('*', verifyAdmin);

Router.post('/', messagesWrap.createMessage, resHandler);

Router.put('/:messageId', verifyParams, messagesWrap.updateMessage, resHandler);

Router.delete('/:messageId', verifyParams, messagesWrap.deleteMessage, resHandler);

module.exports = Router;