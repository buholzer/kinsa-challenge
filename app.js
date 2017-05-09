'use strict';

const server = require('./server');

server.init()
.then(() => {
	server.start();
});

