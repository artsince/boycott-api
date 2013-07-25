
var apimodel = function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var opinionSchema = new Schema({
        id: {type: String, required: true},
        boycott_id: {type: String, required: true},
        boycott_type: {type: String, enum: ['venue', 'corporation', 'event'], required: true},
        opinion: {type: String, required: true},
        agree_count: {type: Number, min: 0, default: 0},
        disagree_count: {type: Number, min: 0, default: 0}
    });

    var venueSchema = new Schema({
        id: {type: String, required: true},
        name: {type: String, required: true},
        foursquare_id: {type: String, required: true, unique: true},
        location: {type: [Number]},
        approve_count: {type: Number, min: 0, default: 0},
        veto_count: {type: Number, min: 0, default: 0}
    });

    venueSchema.index({
        location: '2dsphere'
    });

    // deleting auto-generated _id and __v keys
    venueSchema.method('toClient', function() {
        var obj = this.toObject();

        delete obj._id;
        delete obj.__v;

        return obj;
    });

    // deleting auto-generated _id and __v keys
    opinionSchema.method('toClient', function() {
        var obj = this.toObject();

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