var should   = require('should'),
    assert   = require('assert'),
    request  = require('supertest'),
    mongoose = require('mongoose'),
    app      = require('./../app.js'),
    apimodel = require('./../model');

describe('API routing', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/boycott_db');
    done();
  });

  after(function(done) {
    mongoose.disconnect();
    done();
  });

  describe('GET /api/venues', function() {
    beforeEach(function (done) {
      apimodel.venue.create({
        name: "Starbucks",
        foursquare_id: "16172612681726",
        latitude: 12.123124,
        longitude: 24.2312312,
        agree_count: 0,
        disagree_count: 1
      }, function (res) {
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

  describe('POST /api/venues/add', function() {
    beforeEach(function (done) {
      apimodel.venue.create({
        name: "Starbucks",
        foursquare_id: "16172612681726",
        latitude: 12.123124,
        longitude: 24.2312312,
        agree_count: 0,
        disagree_count: 1
      }, function (res) {
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
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send({
          name: "Starbucks",
          foursquare_id: "16172612681721",
          latitude: 12.123124,
          longitude: 24.2312312,
          agree_count: 0,
          disagree_count: 1
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should respond with venue keys', function (done) {
      var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681720",
        latitude: 12.123124,
        longitude: 24.2312312
      };

      var keys = ['name', 'foursquare_id', 'latitude', 'longitude', 'approve_count', 'veto_count', 'id'];

      request(app)
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send(testVenue)
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.should.have.keys(keys);
          done();
        });
    });

    it('should respond with the same values', function (done) {
      var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681720",
        latitude: 12.123124,
        longitude: 24.2312312
      };

      request(app)
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send(testVenue)
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

    it('should respond with approve and veto counts set to zero', function (done) {
      var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681720",
        latitude: 12.123124,
        longitude: 24.2312312
      };

      request(app)
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send(testVenue)
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.approve_count.should.eql(0);
          res.body.veto_count.should.eql(0);

          done();
        });
    });

    it('should not allow duplicate foursquare ids', function (done) {
      var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681726",
        latitude: 12.123124,
        longitude: 24.2312312
      };

      request(app)
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send(testVenue)
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.should.have.keys(['code', 'msg']);
          done();
        });
    });
  });
});