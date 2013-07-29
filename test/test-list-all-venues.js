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

  describe('GET /api/venues - multiple insertions', function() {
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

    it('should return 20 results', function (done) {
      request(app)
        .get('/api/venues')
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.body.should.have.lengthOf(20);
          done();
        });
    });

    it('should return 30 results', function (done) {
      request(app)
        .get('/api/venues?limit=30')
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.body.should.have.lengthOf(30);
          done();
        });
    });

    it('should return venues in descending order', function (done) {
      request(app)
        .get('/api/venues?limit=30')
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          for(var i = 1, len = res.body.length; i < len; ++i) {
            res.body[i].date_added.should.not.be.above(res.body[i-1].date_added);
          }

          done();
        });
    });

    it('should return venues inserted before the specified date', function (done) {
      request(app)
        .get('/api/venues?max_date=' + test_data[10].date_added)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          test_data[10].date_added.should.not.be.above(res.body[0].date_added)
          
          for(var i = 1, len = res.body.length; i < len; ++i) {
            res.body[i].date_added.should.not.be.above(res.body[i-1].date_added);
          }

          done();
        });
    });

    it('should return at most 5 values before the specified date', function (done) {
      request(app)
        .get('/api/venues?limit=5&max_date=' + test_data[10].date_added)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.body.length.should.not.be.above(5);

          test_data[10].date_added.should.not.be.above(res.body[0].date_added)

          for(var i = 1, len = res.body.length; i < len; ++i) {
            res.body[i].date_added.should.not.be.above(res.body[i-1].date_added);
          }

          done();
        });
    });
  });

  describe('GET /api/venues - one insertion', function() {
    beforeEach(function (done) {
      apimodel.venue.create({
        id: uuid.v4(),
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