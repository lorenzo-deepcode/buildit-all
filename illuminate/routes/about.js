'use strict'

const Express = require('express');
const Router = Express.Router();
const about = require('../services/about');

Router.get('/', about.ping);
Router.get('/deep', about.deepPing);

module.exports = Router;
