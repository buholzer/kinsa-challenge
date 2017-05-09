'use strict';

const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiHttp = require('chai-http');
const server = require('../server');
const config = require('../config');
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiSubset);

let serverUrl;
let baseUrl = `/${config.api.base}/${config.api.version}`;
console.log(baseUrl)

// Coffee Shop test harness
describe('Coffee Shops API', () => {
    before((done) => {
      console.log('');
      server.init()
      .then(() => {
        serverUrl = `localhost:${server.port}`
        return server.start();
      })
      .then(() => {
        console.log(`Running tests against ${serverUrl}\n`)

        done();
      });
    });

  // Test the /GET route
  describe('/GET shop', () => {
    it('it should GET all the coffee shops', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data.length.should.not.be.eql(0);
          done();
        });
    });
    it('it should GET a specific coffee shop', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/1`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.id.should.be.eql(1);
          done();
        });
    });
    it('it should GET a 404 with invalid id', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/10000`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  // Test the /POST route
  describe('/POST shop', () => {

    let newShop = {"name":"Mirko's Coffee","address":"549 Castro St","latitude":37.760203782770596,"longitude":-122.43491565857126};
    let newShopId;

    it('it should POST a new coffee shop', (done) => {
      chai.request(serverUrl)
        .post(`${baseUrl}/shop`)
        .send(newShop)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.be.a.Number;
          newShopId = res.body.id; 
          done();
        });
    });
    it('it should GET the new coffee shop', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/${newShopId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id', newShopId);
          res.body.should.to.containSubset(newShop);
          done();
        });
    });
    it('it should return 400 with invalid content', (done) => {

      delete newShop.name;

      chai.request(serverUrl)
        .post(`${baseUrl}/shop`)
        .send(newShop)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // Test the /PUT route
  describe('/PUT shop', () => {

    let updatedShop = {"id": 1, "name":"Mirko's Coffee","address":"549 Castro St","latitude":37.760203782770596,"longitude":-122.43491565857126};

    it('it should PUT an updated coffee shop', (done) => {
      chai.request(serverUrl)
        .put(`${baseUrl}/shop/${updatedShop.id}`)
        .send(updatedShop)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id', updatedShop.id);
          res.body.should.to.containSubset(updatedShop);
          done();
        });
    });
    it('it should GET the new coffee shop', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/${updatedShop.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.eql(updatedShop);
          done();
        });
    });
    it('it should return with 400 on invalid shop object', (done) => {
      
      delete updatedShop.name

      chai.request(serverUrl)
        .put(`${baseUrl}/shop/${updatedShop.id}`)
        .send(updatedShop)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should return with 404 on invalid id', (done) => {
      
      updatedShop.id = 1000
      updatedShop.name = 'Bluebottle'
      
      chai.request(serverUrl)
        .put(`${baseUrl}/shop/1000`)
        .send(updatedShop)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });


  // Test the /DELETE route
  describe('/DELETE shop', () => {

    let id = 1;

    it('it should DELETE a coffee shop', (done) => {
      chai.request(serverUrl)
        .delete(`${baseUrl}/shop/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id', id);
          done();
        });
    });
    it('it should GET a 404 if retrieving deleted coffee shop', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should return with 404 on invalid id', (done) => {
      
      chai.request(serverUrl)
        .delete(`${baseUrl}/shop/1000`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });


  // Test the /nearest route
  describe('/nearest shop', () => {
    let nearest = [
      {
        address: '535 Mission St., San Francisco, CA',
        nearest: {name: 'Red Door Coffee', id: 16}
      },
      {
        address: '252 Guerrero St, San Francisco, CA 94103, USA',
        nearest: {name: 'Four Barrel Coffee', id: 28}
      }
    ];

    it(`it should GET ${nearest[0].nearest.name} for ${nearest[0].address}`, (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/nearest/${nearest[0].address}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.to.containSubset(nearest[0].nearest);;
          done();
        });
    });
    it(`it should GET ${nearest[1].nearest.name} for ${nearest[1].address}`, (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/nearest/${nearest[1].address}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.to.containSubset(nearest[1].nearest);;
          done();
        });
    });
    it(`it should GET ${nearest[0].nearest.name} for ${nearest[0].address} with url parameter`, (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/?nearestTo=${nearest[0].address}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data[0].should.to.containSubset(nearest[0].nearest);;
          done();
        });
    });
    it('it should GET a 404 with invalid address', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/nearest/someunknownaddressthatdoesnotexist`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('it should GET a 400 with no address', (done) => {
      chai.request(serverUrl)
        .get(`${baseUrl}/shop/nearest/`)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

  });


});