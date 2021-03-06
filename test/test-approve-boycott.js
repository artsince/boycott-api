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

  // POST /api/venues/approve
  describe('POST /api/venues/approve', function() {
    var testVenue = {
        id: uuid.v4(),
        name: "Starbucks",
        foursquare_id: "16172612681726",
        location: [24.2312312, 12.123124],
        agree_count: 0,
        disagree_count: 1
    };

    beforeEach(function (done) {
      apimodel.venue.create(testVenue, function (err, res) {
        if(err) {
            throw err;
        }
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
        .post('/api/venues/approve')
        .set('Accept', 'application/json')
        .send({id: testVenue.id})
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return with approve_count equal to 1', function (done) {
      request(app)
        .post('/api/venues/approve')
        .set('Accept', 'application/json')
        .send({id: testVenue.id})
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.approve_count.should.eql(1);

          done();
        });
    });

    it('should return 404 for non-existent venue', function (done) {
      request(app)
        .post('/api/venues/approve')
        .set('Accept', 'application/json')
        .send({id: '51eb16bd4412f6680a000009'})
        .expect(404, done);
    });

    it('should return with opinion id when text is present', function (done) {
        var keys = ['name', 'foursquare_id', 'location', 'approve_count', 'veto_count', 'id', 'opinion_id', 'date_added'];

        request(app)
            .post('/api/venues/approve')
            .set('Accept', 'application/json')
            .send({id: testVenue.id, opinion: 'Because they only care about profits!'})
            .end(function (err, res) {
               if (err) {
                throw err;
            }

            res.body.should.have.keys(keys);

            done();
        });
    });

    it('should not return with opinion id when text is not present', function (done) {
        var keys = ['name', 'foursquare_id', 'location', 'approve_count', 'veto_count', 'id', 'date_added'];

        request(app)
            .post('/api/venues/approve')
            .set('Accept', 'application/json')
            .send({id: testVenue.id})
            .end(function (err, res) {
               if (err) {
                throw err;
            }

            res.body.should.have.keys(keys);

            done();
        });
    });

    it('should not return with opinion id when text is empty', function (done) {
        var keys = ['name', 'foursquare_id', 'location', 'approve_count', 'veto_count', 'id', 'date_added'];

        request(app)
            .post('/api/venues/approve')
            .set('Accept', 'application/json')
            .send({id: testVenue.id, opinion: ''})
            .end(function (err, res) {
               if (err) {
                throw err;
            }

            res.body.should.have.keys(keys);

            done();
        });
    });

    it('should not return with opinion id when text is empty', function (done) {
        var keys = ['name', 'foursquare_id', 'location', 'approve_count', 'veto_count', 'id', 'date_added'];

        request(app)
            .post('/api/venues/approve')
            .set('Accept', 'application/json')
            .send({id: testVenue.id, opinion: ''})
            .end(function (err, res) {
               if (err) {
                throw err;
            }

            res.body.should.have.keys(keys);

            done();
        });
    });
   });
});