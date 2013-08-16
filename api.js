var models = require('./model');
var uuid = require('node-uuid');
var VenueModel = models.venue;
var OpinionModel = models.opinion;

exports.api = function (req, res) {
    res.send({message: 'API is functional'});
};

exports.newVenue =  function (req, res) {
    var venue = new VenueModel({
        id: uuid.v4(),
        name: req.body.name,
        foursquare_id: req.body.foursquare_id,
        location: req.body.location,
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
    var limit = req.query.limit || req.body.limit || 20;
    var max_date = req.query.max_date || req.query.max_date;
    var query = {};

    if(max_date !== undefined) {
        query.date_added = {$lt: max_date};
    }

    return VenueModel.find(query)
        .sort({date_added: -1})
        .limit(limit)
        .exec(function (err, venues) {
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
    return VenueModel.findOne({id: req.params.id}, function (err, venue) {
        if(!err) {
            if(venue) {
                return res.send(venue.toClient());
            }
            else {
                return res.status(404).send({msg: 'Resource Not Found'});
            }
        }
        else {
            // TODO better eror handling
            return res.status(500).send({code: err.code, msg: 'Error Occurred'});
        }
    });
};

// remove methods should probably be non-public
exports.removeVenue = function (req, res) {
    return res.status(401).send({});
};


// remove methods should probably be non-public
exports.removeAllVenues = function (req, res) {
    return res.status(401).send({});
};

// users can approve a boycott with or without an opinion
// for approve, just increase the approve_count by one.
// then, if there is a text, insert an opinion
exports.approveBoycott = function (req, res) {
    return VenueModel.findOneAndUpdate({id: req.body.id}, {$inc: {approve_count: 1 }}, function (err, venue) {
        if(!err) {
            if(venue) {
                if(req.body.opinion) {
                    var opinion = new OpinionModel({
                        id: uuid.v4(),
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
            // TODO better eror handling
            return res.status(500).send({code: err.code, msg: 'Error Occurred'});
        }
    });
};

// users can veto a boycott with or without an opinion
// for veto, just increase the veto_count by one.
// then, if there is a text, insert an opinion
exports.vetoBoycott = function (req, res) {
    return VenueModel.findOneAndUpdate({id: req.body.id}, {$inc: {veto_count: 1 }}, function (err, venue) {
        if(!err) {
            if(venue) {
                if(req.body.opinion) {
                    var opinion = new OpinionModel({
                        id: uuid.v4(),
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
            // TODO better eror handling
            return res.status(500).send({code: err.code, msg: 'Error Occurred'});
        }
    });
};

// users can agree with an opinion
// increase agree count and return the object
exports.agreeWithOpinion = function (req, res) {
    return OpinionModel.findOneAndUpdate({id: req.params.id}, {$inc: {agree_count: 1 }}, function (err, opinion) {
        if(!err) {
            if(opinion) {
                return res.send(opinion.toClient());
            }
            else {
                return res.status(404).send({msg: 'Resource Not Found'});
            }
        }
        else {
            // TODO better eror handling
            return res.status(500).send({code: err.code, msg: 'Error Occurred'});
        }
    });
};

// users can disagree with an opinion
// increase disagree count and return the object
exports.disagreeWithOpinion  = function (req, res) {
    return OpinionModel.findOneAndUpdate({id: req.params.id}, {$inc: {disagree_count: 1 }}, function (err, opinion) {
        if(!err) {
            if(opinion) {
                return res.send(opinion.toClient());
            }
            else {
                return res.status(404).send({msg: 'Resource Not Found'});
            }
        }
        else {
            // TODO better eror handling
            return res.status(500).send({code: err.code, msg: 'Error Occurred'});
        }
    });
};

exports.listOpinions = function (req, res) {
    var limit = req.query.limit || 50,
        max_date = req.query.max_date,
        filters = {};

    if(req.query.boycott_id) {
        filters.boycott_id = req.query.boycott_id;
    }
    if(max_date !== undefined) {
        filters.date_added = {$lt: max_date};
    }

    return OpinionModel.find(filters).sort({date_added: -1}).limit(limit)
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

exports.searchVenues = function (req, res) {
    var radius = req.query.radius || req.body.radius || 500,
        lat = req.query.lat || req.body.lat || undefined,
        lng = req.query.lng || req.body.lng || undefined,
        lim = req.query.limit || req.body.limit || 20,
        max_date = req.query.max_date || req.body.max_date,
        filter = {};

    if(lat === undefined || lng === undefined) {
        res.status(400).send();
        return;
    }

    filter.location = {$nearSphere: [lng, lat], $maxDistance: radius / 6371000};

    if(max_date !== undefined) {
        filter.date_added = {$lt: max_date};
    }

    var query = VenueModel.find(filter).sort({date_added: -1}).limit(lim);
    return query.exec(function (err, venues) {
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