process.env.NODE_ENV = 'test';

var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    uuid     = require('node-uuid'),
    app      = require('./../app.js'),
    apimodel = require('./../model'),
    async    = require('async'),
    fs       = require('fs'),
    test_data;

describe('API routing', function() {

  before(function(done) {
    fs.readFile('./test/fixtures/venues-with-opinions.json', 'utf-8', function (err, data) {
        if(err) {
          throw err;
        }

        test_data = JSON.parse(data);
        done();
      });
  });

  after(function(done) {
      done();
  });

  // GET /api/opinions'
  describe('GET /api/opinions', function() {

    beforeEach(function (done) {
      async.mapSeries(test_data, function (venueItem, callbackVenue) {
        apimodel.venue.create({
          id: uuid.v4(),
          name: venueItem.name,
          foursquare_id: venueItem.foursquare_id,
          location: [venueItem.lng, venueItem.lat]
        }, function (err, venue) {
          if(err) {
            callbackVenue(err);
          }else {
            venueItem.id = venue.id;

            async.mapSeries(venueItem.opinions, function (opinionItem, callbackOpinion) {
              apimodel.opinion.create({
                id: uuid.v4(),
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
                  opinionItem.id = opinion.id;
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

    it('should respond with JSON', function (done) {
      request(app)
        .get('/api/opinions')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
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

          res.body.length.should.eql(20);

          done();
        });
    });

    it('should return 6 opinions for the first venue', function (done) {
      request(app)
        .get('/api/opinions?boycott_id=' + test_data[0].id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(6);

          done();
        });
    });

    it('should return 15 opinions for the third venue', function (done) {
      request(app)
        .get('/api/opinions?limit=15&boycott_id=' + test_data[2].id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.length.should.eql(15);

          done();
        });
    });
  });
});