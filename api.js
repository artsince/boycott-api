var models = require('./model'); 
var VenueModel = models.VenueModel;
var OpinionModel = models.OpinionModel;

exports.api = function (req, res) {
	res.send({message: 'API is functional'});
};

exports.newVenue =  function (req, res) {
	var venue;
	console.log('POST: ');
	console.log(req.body);
	venue = new VenueModel({
		name: req.body.name,
		foursquare_id: req.body.foursquare_id,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
	});
	venue.save(function (err) {
		if(!err) {
			return console.log('created');
		}
		else {
			return console.log(err);
		}
	});

	return res.send(venue);
};

exports.listAllVenues = function (req, res) {
	return VenueModel.find(function (err, venues) {
		if(!err) {
			return res.send(venues);
		}
		else {
			return console.log(err);
		}
	});
};

exports.showVenue = function (req, res) {

};

exports.removeVenue = function (req, res) {

};

exports.removeAllVenues = function (req, res) {

};

exports.approveBoycott = function (req, res) {

};

exports.vetoBoycott = function (req, res) {

};

exports.agreeWithOpinion = function (req, res) {

};

exports.disagreeWithOpinion  = function (req, res) {

};

