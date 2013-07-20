var models = require('./model');
var VenueModel = models.venue;
var OpinionModel = models.opinion;

exports.api = function (req, res) {
	res.send({message: 'API is functional'});
};

exports.newVenue =  function (req, res) {
	var venue;
	venue = new VenueModel({
		name: req.body.name,
		foursquare_id: req.body.foursquare_id,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		approve_count: 0,
		veto_count: 0
	});
	venue.save(function (err) {
		if(!err) {
			return res.send(venue.toClient());
		}
		else {
			// TODO better eror handling
			//console.log(err);
			return res.status(500).send({code: err.code, msg: err.err});
		}
	});
};

exports.listAllVenues = function (req, res) {
	return VenueModel.find(function (err, venues) {
		if(!err) {

			return res.send(venues.map(function (venue) {
				return venue.toClient();
			}));
		}
		else {
			// TODO better eror handling
			return res.status(500).send({code: err.code, msg: 'Error Occurred'});
		}
	});
};

exports.showVenue = function (req, res) {
	return VenueModel.findOne({_id: req.params.id}, function (err, venue) {
		if(!err) {
			if(venue) {
				return res.send(venue.toClient());
			}
			else {
				return res.status(404).send({msg: 'Resource Not Found'});
			}
		}
		else {
			if(err.name == "CastError") {
				return res.status(404).send({msg: 'Unacceptable Id Value'});
			}

			// TODO better eror handling
			return res.status(500).send({code: err.code, msg: 'Error Occurred'});
		}
	});
};

// remove methods should probably be non-public
exports.removeVenue = function (req, res) {
	return res.send({});
};


// remove methods should probably be non-public
exports.removeAllVenues = function (req, res) {
	return res.send({});
};

exports.approveBoycott = function (req, res) {
	return res.send({});
};

exports.vetoBoycott = function (req, res) {
	return res.send({});
};

exports.agreeWithOpinion = function (req, res) {
	return res.send({});
};

exports.disagreeWithOpinion  = function (req, res) {
	return res.send({});
};

