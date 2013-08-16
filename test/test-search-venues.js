process.env.NODE_ENV = 'test';

var should    = require('should'),
    assert    = require('assert'),
    request   = require('supertest'),
    mongoose  = require('mongoose'),
    async     = require('async'),
    fs        = require('fs'),
    uuid      = require('node-uuid'),
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
        var latest_date = Date.now();

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

            latest_date = latest_date - 43200000;

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

    it('should respond with JSON', function (done) {
      request(app)
        .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&radius=50')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return 400 when lat or lng is not present', function (done) {
      request(app)
        .get('/api/search/venues?max_date=' + test_data[10].date_added)
        .set('Accept', 'application/json')
        .expect(400, done);
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

    it('should return venues in descending order', function (done) {
      request(app)
        .get('/api/search/venues?limit=30&lng=28.985136662087776&lat=41.03652447338111')
        .expect(200)
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
        .get('/api/search/venues?lng=28.985136662087776&lat=41.03652447338111&max_date=' + test_data[10].date_added)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          test_data[10].date_added.should.not.be.above(res.body[0].date_added);
          
          for(var i = 1, len = res.body.length; i < len; ++i) {
            res.body[i].date_added.should.not.be.above(res.body[i-1].date_added);
          }

          done();
        });
    });
  });
});