'use strict';

const NodeGeocoder = require('node-geocoder');
const config = require('../../config');

const geocoder = NodeGeocoder(config.geocoder);

const filterNearest = function filterNearest (shops, address) {

	return geocoder.geocode(address)
	.then(result => {

		if (result.length > 0) {
			// We always grab the first result, there might be multiple
			const targetLatitude = result[0].latitude;
			const targetLongitude = result[0].longitude;

			let nearestDistance = -1;
			let nearestShop = null;

			// this is a poor mans approach to get the shortest distance
			// in a real world example we would use a kd tree or a database that knows
			// how to handle lat/long queries
			for(var key in shops) {
				let shop = shops[key];
				let distance = getDistanceFromLatLonInKm(targetLatitude, targetLongitude, shop.latitude, shop.longitude);
				if (nearestDistance === -1 || distance < nearestDistance) {
					nearestDistance = distance;
					nearestShop = shop;
				};
			};

			return nearestShop;

		} else {
			// address not found
			return null;
		}
  });

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports = {
	filterNearest
}