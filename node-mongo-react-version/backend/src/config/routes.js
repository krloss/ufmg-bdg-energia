const express = require('express');

const Location = require('../controllers/Location');

const routes = express.Router();

routes.get('/locations',Location.index);
routes.post('/locations',Location.save);

module.exports = routes;
