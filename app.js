var application_root = __dirname,
    express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    api = require('./api'),
    cfg = require('./config');

var app = express();


// config 
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
});


mongoose.connect(cfg.mongo.connectionString);

app.on('close', function () {
  mongoose.disconnect();
});

// REST API
app.get('/api', api.api);
app.get('/api/venues', api.listAllVenues);
app.post('/api/venues/add', api.newVenue);
app.get('/api/venues/:id', api.showVenue);
app.delete('/api/venues/', api.removeAllVenues); // this method should work only for admins
app.delete('/api/venues/:id', api.removeVenue); // this method should work only for admins
app.post('/api/venues/approve', api.approveBoycott);
app.post('/api/venues/veto', api.vetoBoycott);
app.post('/api/opinions/:id/agree', api.agreeWithOpinion);
app.post('/api/opinions/:id/disagree', api.disagreeWithOpinion);


app.listen(process.env.PORT || 4242);

module.exports = app;
