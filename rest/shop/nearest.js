'use strict';

const data = require('../../data');
const common = require('./common.js');

module.exports = function nearestCoffeeShop (req, res, next) {

  const address = req.params.address;

  if (address) {
  	// find closest to address
  	return common.filterNearest(data.shops, address)
  	.then((result) => {
  		// return result if found, else return 404 not found
  		if (result) {
  			res.send(200, result);
  		} else res.send(404);
  	})
  } else {
  	// need an address to process request
  	res.send(400);
	}
	
};
