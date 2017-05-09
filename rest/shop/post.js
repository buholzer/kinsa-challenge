'use strict';

const Joi = require('joi');
const data = require('../../data');
const {shop} = require('../../model');

module.exports = function createCoffeeShop (req, res, next) {

 	let newShop = req.body;
 	newShop.id = data.shopsNextId++;

  const result = Joi.validate(newShop, shop.Schema);

  if (result.error === null) {
  	data.shops[newShop.id] = newShop;
  	res.send(201, newShop);
  } else {
		res.send(400);
  }

};