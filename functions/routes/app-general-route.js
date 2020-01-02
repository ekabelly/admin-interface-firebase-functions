const express = require('express');
const Router = express.Router();
const { fetchConfig, fetchTags, removeTag } = require('../wrappers/app-general-wrap');
const { resHandler } = require('../middlewares/app-middlewares');
const { verifyAdmin } = require('../middlewares/auth');

Router.get('/config', fetchConfig, resHandler);

// Router.all('*', verifyAdmin);

Router.delete('/config/tag/:tagId', fetchTags, removeTag, resHandler);

module.exports = Router;