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

  // POST /api/opinions/:id/disagree'
  describe('POST /api/opinions/:id/disagree', function() {
    var venue_id, opinion_id;
    var testVenue = {
        name: "Starbucks",
        foursquare_id: "16172612681726",
        location: [24.2312312, 12.123124],
        agree_count: 0,
        disagree_count: 1
    };
    var testOpinion = {
      boycott_type: 'venue',
      opinion: 'Because they password-protect their bathrooms',
      agree_count: 6,
      disagree_count: 1
    };

    beforeEach(function (done) {
      apimodel.venue.create(testVenue, function (err, v) {
        venue_id = v.id
        testOpinion.boycott_id = v.id;
        apimodel.opinion.create(testOpinion, function (err, o) {
          if(!err) {
            opinion_id = o.id;
            done();
          }
        });
      });
    });

    afterEach(function (done) {
      apimodel.venue.remove({}, function () {
        apimodel.opinion.remove({}, function () {
          done();
        });
      });
    });

    it('should return with disagree count equal to 2', function (done) {
      request(app)
        .post('/api/opinions/' + opinion_id + '/disagree')
        .set('Accept', 'application/json')
        .end(function (err, res) {
           if (err) {
            throw err;
          }

          res.body.disagree_count.should.eql(2);

          done();
        });
    });

    it('should return 404 for a non-existent opinion id', function (done) {
      request(app)
        .post('/api/opinions/'+ venue_id +'/disagree')
        .set('Accept', 'application/json')
        .expect(404, done);
      });

    it('should return 404 for an incompatible opinion id', function (done) {
      request(app)
        .post('/api/opinions/6a8s7d6as80asd/disagree')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return with object containing opinion keys', function (done) {
      var keys = ['boycott_id', 'boycott_type', 'opinion', 'agree_count', 'disagree_count', 'id'];
      request(app)
        .post('/api/opinions/'+ opinion_id +'/disagree')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if(err) {
            throw err;
          }

          res.body.should.have.keys(keys);

          done();
        });
    });

    it('should only change disagree count', function (done) {
      request(app)
        .post('/api/opinions/'+ opinion_id +'/disagree')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if(err) {
            throw err;
          }

          res.body.boycott_id.should.eql(testOpinion.boycott_id);
          res.body.boycott_type.should.eql(testOpinion.boycott_type);
          res.body.opinion.should.eql(testOpinion.opinion);
          res.body.agree_count.should.eql(testOpinion.agree_count);

          done();
        });
    });
  });
});