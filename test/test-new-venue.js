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

  describe('POST /api/venues/add', function() {
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
        .post('/api/venues/add')
        .set('Accept', 'application/json').
        send({
          id: uuid.v4(),
          name: "Starbucks",
          foursquare_id: "16172612681721",
          location: [24.2312312, 12.123124],
          agree_count: 0,
          disagree_count: 1
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should respond with venue keys', function (done) {
      var testVenue = {
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681720",
        location: [24.2312312, 12.123124]
      };

      var keys = ['name', 'foursquare_id', 'location', 'approve_count', 'veto_count', 'id'];

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
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681720",
        location: [24.2312312, 12.123124]
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
          res.body.location[1].should.eql(testVenue.location[1]);
          res.body.location[0].should.eql(testVenue.location[0]);

          done();
        });
    });

    it('should respond with approve and veto counts set to zero', function (done) {
      var testVenue = {
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681720",
        location: [24.2312312, 12.123124]
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
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681726",
        location: [24.2312312, 12.123124]
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