const express = require('express');
const Router = express.Router();
const { fetchConfig } = require('../wrappers/app-general-wrap');
const { resHandler } = require('../middlewares/app-middlewares');

Router.get('/config', fetchConfig, resHandler);

module.exports = Router;