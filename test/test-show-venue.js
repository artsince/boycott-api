process.env.NODE_ENV = 'test';

var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    uuid     = require('node-uuid'),
    app      = require('./../app.js'),
    apimodel = require('./../model');

describe('API routing', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
      done();
  });

  describe("GET /api/venues/:id", function () {
    var testVenue = {
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681726",
        location: [24.2312312, 12.123124],
        agree_count: 0,
        disagree_count: 1
    };

    beforeEach(function (done) {
      apimodel.venue.create(testVenue, function (err, res) {
        done();
      });
    });

    afterEach(function (done) {
      apimodel.venue.remove({}, function () {
        done();
      });
    });

    it('should respond with JSON', function (done) {
      request(app)
        .get('/api/venues/' + testVenue.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return object with requested id', function (done) {
       request(app)
        .get('/api/venues/' + testVenue.id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.id.should.eql(testVenue.id);
          done();
        });
    });

    it('should return the correct venue', function (done) {
       request(app)
        .get('/api/venues/' + testVenue.id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.name.should.eql(testVenue.name);
          res.body.foursquare_id.should.eql(testVenue.foursquare_id);
          res.body.location[1].should.eql(testVenue.location[1]);
          res.body.location[0].should.eql(testVenue.location[0]);

          done();
        });
    });

    it('should return 404 for nonexistent venue', function (done) {
       request(app)
        .get('/api/venues/51eb16bd4412f6680a000009')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

  });
});