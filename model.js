var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/boycott_db');

var Schema = mongoose.Schema;

var Opinion = new Schema({
	boycott_id: {type: String, required: true}, 
	boycott_type: {type: String, enum: ['venue', 'corporation', 'event'], required: true},
	text: {type: String, required: true},
	agree_count: {type: Number, min: 0},
	disagree_count: {type: Number, min: 0}
});

var Venue = new Schema({
	name: {type: String, required: true},
	foursquare_id: {type: String, required: true},
	latitude: {type: Number, required: true},
	longitude: {type: Number, required: true},
	agree_count: {type: Number, min: 0},
	disagree_count: {type: Number, min: 0}
});

exports.VenueModel = mongoose.model('Venue', Venue);
exports.OpinionModel = mongoose.model('Opinion', Opinion);