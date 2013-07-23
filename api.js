var models = require('./model');
var VenueModel = models.venue;
var OpinionModel = models.opinion;

exports.api = function (req, res) {
    res.send({message: 'API is functional'});
};

exports.newVenue =  function (req, res) {
    var venue = new VenueModel({
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

// users can approve a boycott with or without an opinion
// for approve, just increase the approve_count by one.
// then, if there is a text, insert an opinion
exports.approveBoycott = function (req, res) {
    return VenueModel.findByIdAndUpdate(req.body.id, {$inc: {approve_count: 1 }}, function (err, venue) {
        if(!err) {
            if(venue) {
                if(req.body.opinion) {
                    var opinion = new OpinionModel({
                        boycott_id: venue._id,
                        boycott_type: 'venue',
                        opinion: req.body.opinion
                    });

                    return opinion.save(function (err) {
                        if(!err) {
                            var combinedObj = venue.toClient();
                            combinedObj.opinion_id = opinion._id;
                            return res.send(combinedObj);
                        }
                        else {
                            var errObj = {code: err.code, msg: 'Error Occurred'};
                            // taking back the approve increment if an error occurs while saving the opinion.                            
                            VenueModel.update(req.body.id, {$dec: {approve_count: 1}}, function (err, rowsAffected, raw) {
                                return res.status(500).send(errObj);
                            });
                        }
                    });
                }
                else {
                    return res.send(venue.toClient());
                }
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

// users can veto a boycott with or without an opinion
// for veto, just increase the veto_count by one.
// then, if there is a text, insert an opinion
exports.vetoBoycott = function (req, res) {
    return VenueModel.findByIdAndUpdate(req.body.id, {$inc: {veto_count: 1 }}, function (err, venue) {
        if(!err) {
            if(venue) {
                if(req.body.opinion) {
                    var opinion = new OpinionModel({
                        boycott_id: venue._id,
                        boycott_type: 'venue',
                        opinion: req.body.opinion
                    });

                    return opinion.save(function (err) {
                        if(!err) {
                            var combinedObj = venue.toClient();
                            combinedObj.opinion_id = opinion._id;
                            return res.send(combinedObj);
                        }
                        else {
                            var errObj = {code: err.code, msg: 'Error Occurred'};
                            // taking back the veto increment if an error occurs while saving the opinion.                            
                            VenueModel.update(req.body.id, {$dec: {veto_count: 1}}, function (err, rowsAffected, raw) {
                                return res.status(500).send(errObj);
                            });
                        }
                    });
                }
                else {
                    return res.send(venue.toClient());
                }
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

// users can agree with an opinion
// increase agree count and return the object
exports.agreeWithOpinion = function (req, res) {
    return OpinionModel.findByIdAndUpdate(req.params.id, {$inc: {agree_count: 1 }}, function (err, opinion) {
        if(!err) {
            if(opinion) {
                return res.send(opinion.toClient());
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

// users can disagree with an opinion
// increase disagree count and return the object
exports.disagreeWithOpinion  = function (req, res) {
    return OpinionModel.findByIdAndUpdate(req.params.id, {$inc: {disagree_count: 1 }}, function (err, opinion) {
        if(!err) {
            if(opinion) {
                return res.send(opinion.toClient());
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

exports.listOpinions = function (req, res) {
    var limit = req.param.limit || 50,
        filters = {};
    if(req.param.boycott_id) {
        filters['boycott_id'] = req.param.boycott_id;
    }

    return OpinionModel.find(filters).sort({_id: 1}).limit(limit)
        .exec(function (err, opinions) {
            if(!err) {
                return res.send(opinions.map(function (opinion) {
                    return opinion.toClient();
                }));
            }
            else {
                // TODO better eror handling
                return res.status(500).send({code: err.code, msg: 'Error Occurred'});
            }
        });
};

