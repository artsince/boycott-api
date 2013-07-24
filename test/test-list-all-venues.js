process.env.NODE_ENV = 'test';

var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    app      = require('./../app.js'),
    apimodel = require('./../model');

describe('API routing', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
      done();
  });

  describe('GET /api/venues', function() {
    beforeEach(function (done) {
      apimodel.venue.create({
        name: "Starbucks",
        foursquare_id: "16172612681726",
        location: [24.2312312, 12.123124],
        agree_count: 0,
        disagree_count: 1
      }, function (err) {
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
        .get('/api/venues')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return one venue', function(done) {
      request(app)
        .get('/api/venues')
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.body.should.have.lengthOf(1);
          done();
        });
    });

    it('should not return two venues', function(done) {
      request(app)
        .get('/api/venues')
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.body.should.not.have.lengthOf(2);
          done();
        });
    });
  });
});