process.env.NODE_ENV = 'test';

var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    uuid     = require('node-uuid'),
    async    = require('async'),
    fs       = require('fs'),
    app      = require('./../app.js'),
    apimodel = require('./../model'),
    test_data;

describe('API routing', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
      done();
  });

  describe('DELETE /api/venues', function() {
    beforeEach(function (done) {
      fs.readFile('./test/fixtures/venue-list.json', 'utf-8', function (err, data) {
        if(err) {
          throw err;
        }

        var latest_date = Date.now();
        test_data = JSON.parse(data);

        async.mapSeries(test_data, function (venueItem, callback) {
          
          apimodel.venue.create({
            id: uuid.v4(),
            name: venueItem.name,
            foursquare_id: venueItem.foursquare_id,
            location: [Number(venueItem.lng), Number(venueItem.lat)],
            date_added: latest_date
          }, function (err, venue) {
            if(err) {
              callback(err);
            }

            venueItem.id = venue.id;
            venueItem.date_added = latest_date;

            latest_date = latest_date - 86400000;

            callback(null);
          });
        }, function (err, results) {
          if(err) {
            throw err;
          }
          done();
        });
      });
    });

    afterEach(function (done) {
      apimodel.venue.remove({}, function () {
        done();
      });
    });

    it('should return 401', function (done) {
      request(app)
        .del('/api/venues')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });
});