'use strict';

const data = require('../../data');
const common = require('./common.js');

module.exports = function getCoffeeShop (req, res, next) {

  const shopId = req.params.id;

  if (shopId) {
  	// return single object if it exists
	  if (Object.prototype.hasOwnProperty.call(data.shops, shopId)) {
	  	res.send(200, data.shops[shopId]);
	  } else res.send(404);
	} else {

		// check if we want to filter the nearest only
	  const address = req.params.nearestTo;

	  if (address) {
	  	// find nearest to address
	  	return common.filterNearest(data.shops, address)
	  	.then((result) => {
	  		// return result if found, else return 404 not found
	  		if (result) {
	  			res.send(200, {data: [result], count: 1, total: 1});
	  		} else res.send(404);
	  	})
	  } else {
			// return full list, consider implementing paging
			let result = [];
			for(var key in data.shops) result.push(data.shops[key]);
			res.send(200, {data: result, count: result.length, total: result.length});
		}
	}
	
};
