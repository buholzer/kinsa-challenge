'use strict';

const Promise = require('bluebird')
const restify = require('restify');
const validator = require('restify-joi-middleware');
const logger  = require('morgan');
const restShop = require('./rest/shop');
const config = require('./config');
const data = require('./data');


const port = config.server.port;
const server = restify.createServer(config.server);

// Setup simple logging
if (process.env.NODE_ENV !== 'test') server.use(logger('dev'));

// Add the query parser
server.use(restify.queryParser());

// Add validation option
server.use(validator());

// Parse the json body into req.body 
server.use(restify.bodyParser({ mapParams: false }));

restShop(server);

server.listen = Promise.promisify(server.listen, { context: server });
server.close = Promise.promisify(server.close, { context: server });

module.exports.init = () => {
	return data.init();
}

module.exports.start = () => {
	return server.listen(port)
	.then(() => {
		console.log(`REST API started at - ${server.url}`);
		return server;
	});
}

module.exports.port = port;
