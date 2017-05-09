'use strict';

const Promsie = require('bluebird'); 
const fs = require('fs'); 
const parse = require('csv-parse');
const config = require('../config');

const dataPath = config.dataPath;
const dataStructure = ['id', 'name', 'address', 'latitude', 'longitude'];

const loadShops = function loadData() {
	let data = [];
	let maxId = 0;

	console.log('Initializing data');

	return new Promise((resolve, reject) => {

		try {
			fs.createReadStream(dataPath)
			.pipe(parse({delimiter: ','}))
			.on('data', (row) => {
				
				let shop = row.reduce((result, item, index) => { 
					
					// This is hard coded, could be made generic
					switch (index) {
						case 1:
						case 2:
							result[dataStructure[index]] = item.trim();
							break;
						case 0:
						case 3:
						case 4:
							result[dataStructure[index]] = Number(item);
							break;
					}
					
					return result;
				}, {});

				// keep track of largest id
				if (shop.id > maxId) maxId = shop.id;

				data.push(shop);

			})
			.on('end',() => {
				console.log('Data successfully loaded');
				let nextId = maxId + 1;
				resolve({ data, nextId });
			})
			.on('error', (e) => {
				console.error(`Error while processing data - ${e.message}`);
				reject(e)
			});
		} catch(e) {
			console.error(`Error while accessing file ${dataPath} - ${e.message}`);
			reject(e)
		}

	});
}

let shops = {};
let shopsNextId = 0;

const init = function init() {
	return loadShops()
	.then((shopData) => {

		shopData.data.forEach((item) => { shops[item.id] = item; });
		module.exports.shopsNextId = shopData.nextId

	});
};

module.exports =  {
	init,
  shops,
  shopsNextId
};
