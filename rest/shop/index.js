'use strict';

const Joi = require('joi');
const config = require('../../config');
const data = require('../../data');

module.exports = function shopEndpoint (server, options) {

	const baseUrl = `/${config.api.base}/${config.api.version}`;

	// Read Coffee Shops or Shop based on id
  server.get({
    path: `${baseUrl}/shop`,
    description: 'Get all coffee shops',
  }, require('./get.js'));

  server.get({
    path: `${baseUrl}/shop/:id`,
    description: 'Get a coffee shop',
  }, require('./get.js'));

  // Create Coffee Shop
  server.post({
    path: `${baseUrl}/shop`,
    description: 'Create a coffee shop',
  }, require('./post.js'));

  // Update Coffee Shop
  server.put({
    path: `${baseUrl}/shop/:id`,
    description: 'Update a coffee shop',
  }, require('./put.js'));

  // Delete Coffee Shop
  server.del({
    path: `${baseUrl}/shop/:id`,
    description: 'Delete a coffee shop',
    validation: {
	    params: {
	      id: Joi.number().min(0).required()
	    }
	  }
	}, require('./delete.js'));

  // Get nearest Coffee Shop
  server.get({
    path: `${baseUrl}/shop/nearest/:address`,
    description: 'Get the nearest coffee shop',
  }, require('./nearest.js'));

};
