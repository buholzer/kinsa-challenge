'use strict';

const data = require('../../data');

module.exports = function deleteCoffeeShop (req, res, next) {

  const shopId = req.params.id;

	if (Object.prototype.hasOwnProperty.call(data.shops, shopId)) {

		let shop = data.shops[shopId];
		delete data.shops[shopId];
		res.send(200, shop);

	} else res.send(404);

};