'use strict';

const Joi = require('joi');
const data = require('../../data');
const {shop} = require('../../model');

module.exports = function updateCoffeeShop (req, res, next) {

 	let newShop = req.body;

  const result = Joi.validate(newShop, shop.Schema);

  if (result.error === null) {

  	// Check if we have the shop with the provided id
  	if (Object.prototype.hasOwnProperty.call(data.shops, newShop.id)) {
	  	data.shops[newShop.id] = newShop;
	  	res.send(200, newShop);
  	} else res.send(404);

  } else {
		res.send(400);
  }

};