process.env.NODE_ENV = 'test';

var should    = require('should'),
    assert    = require('assert'),
    request   = require('supertest'),
    mongoose  = require('mongoose'),
    async     = require('async'),
    fs        = require('fs'),
    app       = require('./../app.js'),
    apimodel  = require('./../model'),
    test_data;

describe('API routing', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
      done();
  });

  // GET /api/search/venues'
  describe('GET /api/search/venues', function() {

    beforeEach(function (done) {
      // read the json file into test_data, then insert into db with async
      fs.readFile('./test/fixtures/venue-list.json', 'utf-8', function (err, data) {
        if(err) {
          throw err;
        }

        test_data = JSON.parse(data);

        async.mapSeries(test_data, function (venueItem, callback) {
          apimodel.venue.create({
            name: venueItem.name,
            foursquare_id: venueItem.foursquare_id,
            latitude: venueItem.lat,
            longitude: venueItem.lng,
            location: [Number(venueItem.lng), Number(venueItem.lat)]
          }, function (err, venue) {
            if(err) {
              callback(err);
            }

            venueItem.id = venue._id;
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
      apimodel.venue.remove(function (err) {
        done();
      });
    });

    it('should return more results for a larger radius', function (done) {
      var small_radius, large_radius;
      request(app)
        .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&radius=50')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          small_radius = res.body.length;

          request(app)
            .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&radius=5000')
            .set('Accept', 'application/json')
            .end(function (err, res) {
              if (err) {
                throw err;
              }

              large_radius = res.body.length;

              large_radius.should.be.above(small_radius);
              done();
            });
        });
    });

    it('should return max 20 results', function (done) {
      request(app)
        .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&radius=5000&limit=20')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.not.be.above(20);
          done();
        });
    });

    it('should return exactly 1 result', function (done) {
      request(app)
        .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&radius=5000&limit=1')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(1);
          done();
        });
    });
  });
});