
var apimodel = function () {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	//mongoose.connect('mongodb://localhost/boycott_db');

	var opinionSchema = new Schema({
		boycott_id: {type: String, required: true},
		boycott_type: {type: String, enum: ['venue', 'corporation', 'event'], required: true},
		text: {type: String, required: true},
		agree_count: {type: Number, min: 0},
		disagree_count: {type: Number, min: 0}
	});

	var venueSchema = new Schema({
		name: {type: String, required: true},
		foursquare_id: {type: String, required: true, unique: true},
		latitude: {type: Number, required: true},
		longitude: {type: Number, required: true},
		approve_count: {type: Number, min: 0},
		veto_count: {type: Number, min: 0}
	});

		// Duplicate the ID field.
	venueSchema.method('toClient', function() {
		var obj = this.toObject();

		obj.id = obj._id;
		delete obj._id;
		delete obj.__v;

		return obj;
	});

	var _opinionModel = mongoose.model('opinion', opinionSchema);
	var _venueModel = mongoose.model('venue', venueSchema);

	return {
		opinion: _opinionModel,
		venue: _venueModel
	};
}();

module.exports = apimodel;