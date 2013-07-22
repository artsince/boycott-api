process.env.NODE_ENV = 'test';

var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    app      = require('./../app.js'),
    apimodel = require('./../model'),
    async    = require('async'),
    test_data = require('./fixtures/venues-with-opinions.js');

describe('API routing', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
      done();
  });

  // GET /api/opinions'
  describe('GET /api/opinions', function() {

    beforeEach(function (done) {
      async.mapSeries(test_data, function (venueItem, callbackVenue) {
        apimodel.venue.create({
          name: venueItem.name,
          foursquare_id: venueItem.foursquare_id,
          latitude: venueItem.lat,
          longitude: venueItem.lng
        }, function (err, venue) {
          if(err) {
            callback(err);
          }else {
            venueItem.id = venue._id;

            async.mapSeries(venueItem.opinions, function (opinionItem, callbackOpinion) {
              apimodel.opinion.create({
                boycott_id: venueItem.id,
                boycott_type: 'venue',
                opinion: opinionItem.text,
                agree_count: opinionItem.positive ? 1 : 0,
                disagree_count: opinionItem.positive ? 0 : 1
              }, function (err, opinion) {
                if(err) {
                  callbackOpinion(err);
                }
                else {
                  opinionItem.id = opinion._id;
                  callbackOpinion(null);
                }
              });
            }, function (err, results) {
              callbackVenue(err);
            });
          }
        });
      }, function (err, results) {
        if(err) {
          throw err;
        }
        done();
      });
    });

    afterEach(function (done) {
      async.series([
        function(callback) {
          apimodel.venue.remove(function (err) {
            callback(err);
          });
        },
        function (callback) {
          apimodel.opinion.remove(function (err) {
            callback(err);
          });
        }
        ], function (err, results) {
          if(err) {
            throw err;
          }
          done();
        });
    });

    it('should return 46 opinions for all', function (done) {
      request(app)
        .get('/api/opinions')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(46);

          done();
        });
    });

    it('should return 20 opinions for all', function (done) {
      request(app)
        .get('/api/opinions?limit=20')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(46);

          done();
        });
    });

    it('should return 6 opinions for the first venue', function (done) {
      request(app)
        .get('/api/opinions?boycott_id=' + test_data[0]._id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(46);

          done();
        });
    });

    it('should return 15 opinions for the third venue', function (done) {
      request(app)
        .get('/api/opinions?limit=15&boycott_id=' + test_data[2]._id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(46);

          done();
        });
    });
  });
});