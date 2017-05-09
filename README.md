Kinsa Challenge - Coffee Shop Lovers
====================================

This is a implementation of the Kinsa coding challenge. The goal of this test is to create an API for 
finding the nearest coffee shop by providing an address.

This project implements a simple restify server on Node.js 6.x that runs by default on port 3000. All CRUD operations  
have been implemented for the **/api/v1/shop** endpoint. 

To get the nearest coffee shop a filter with a query parameter **nearestTo** has been implemented on the 
**/api/v1/shop** get endpoint. This allows to filter the list of shops to the nearest of a specified address. 
Since the challenge requested a specific endpoint to find the nearest endpoint, an additional endpoint has 
been made available at **/api/v1/shop/nearest**.

The data is loaded from the csv file into a memory structure, all changes to the data is handled in memory only and 
all data is reinitialized when the server is restarted.

The API uses the Google Geocoding API and a valid API key needs to be added in the configuration. You can generate an API key at https://developers.google.com/maps/documentation/geocoding/get-api-key, copy the config.template file to config.js and replace the placeholder **YOUR_GECODING_API_KEY** with your key.

The current distance calculation and filtering is a very rudimentary implementation. This works for a small in memory 
dataset, but needs clearly to be updated. In general a database would be used that supports geospatial indexes or a in 
memory kd tree could be used as well in case no database is available.


## Quick Start

Make sure you have Node.js v6.x installed on your system, you can install it from https://nodejs.org/en/download/.

### Installation

    $ npm install
    
### Configuration

Copy the config.template file to config.js and update the placeholder **YOUR_GECODING_API_KEY** 
in the config.js file with your Google Geocoding API key.
You can generate a key at https://developers.google.com/maps/documentation/geocoding/get-api-key

### Running tests

    $ npm test

### Running the server

    $ npm start

  

## Client API test
### Curl API test examples
#### Get all coffee shops
```
curl -i http://localhost:3000/api/v1/shop
```

#### Get specific coffee shop
```
curl -i http://localhost:3000/api/v1/shop/1
```

#### Create a coffee shop
```
curl -i -H "Content-Type: application/json" -X POST -d '{"name":"Philz Coffee","address":"549 Castro St","latitude":37.760203782770596,"longitude":-122.43491565857126}' http://localhost:3000/api/v1/shop
```

#### Update a specific coffee shop
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"id":34,"name":"Philz Coffee","address":"549 Castro St","latitude":37.760203782770596,"longitude":-122.43491565857126}' http://localhost:3000/api/v1/shop/34
```

#### Delete a specific coffee shop
```
curl -i -X "DELETE" http://localhost:3000/api/v1/shop/34
```

#### Get nearest coffee shop 
```
curl -i http://localhost:3000/api/v1/shop/nearest/252%20Guerrero%20St,%20San%20Francisco,%20CA%2094103,%20USA
```
```
curl -i http://localhost:3000/api/v1/shop/?nearestTo=252%20Guerrero%20St,%20San%20Francisco,%20CA%2094103,%20USA
```


### TODO
* Use swagger to document the full API
* Use a database that can index lat/long or an in memory kd tree
* Add authentication / API keys
* Implement rate limiting
* Implement throttling if rate is exceeded
* Implement CORS for local development
* Implement paging
* Handle edge case if 2 coffee places are at the exact same distance, probability low
* Friendlier error msg to the client in addition to http status code
* Implement Server Error handling and restart
