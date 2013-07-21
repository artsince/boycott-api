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

  describe("GET /api/venues/:id", function () {
    var venue_id;
    var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681726",
        latitude: 12.123124,
        longitude: 24.2312312,
        agree_count: 0,
        disagree_count: 1
    };

    beforeEach(function (done) {
      apimodel.venue.create(testVenue, function (err, res) {
        venue_id = res.id;
        done();
      });
    });

    afterEach(function (done) {
      apimodel.venue.remove({}, function () {
        done();
      });
    });

    it('should return object with requested id', function (done) {
       request(app)
        .get('/api/venues/' + venue_id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.id.should.eql(venue_id);
          done();
        });
    });

    it('should return the correct venue', function (done) {
       request(app)
        .get('/api/venues/' + venue_id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.name.should.eql(testVenue.name);
          res.body.foursquare_id.should.eql(testVenue.foursquare_id);
          res.body.latitude.should.eql(testVenue.latitude);
          res.body.longitude.should.eql(testVenue.longitude);

          done();
        });
    });

    it('should return 404 for nonexistent venue', function (done) {
       request(app)
        .get('/api/venues/51eb16bd4412f6680a000009')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return 404 for improper id for venue', function (done) {
       request(app)
        .get('/api/venues/2312312312')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });
});