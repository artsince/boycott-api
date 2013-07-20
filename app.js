var application_root = __dirname,
    express = require('express'),
    path = require('path'),
	api = require('./api');

var app = express();


// config 
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
});

// REST API
app.get('/api', api.api);
app.post('/api/venues/add', api.newVenue);
app.get('/api/venues', api.listAllVenues);
app.get('/api/venues/:id', api.showVenue);
app.delete('/api/venues/', api.removeAllVenues); // this method should work only for admins
app.delete('/api/venues/:id', api.removeVenue); // this method should work only for admins
app.post('/api/venues/approve', api.approveBoycott);
app.post('/api/venues/veto', api.vetoBoycott);
app.post('/api/opinions/:id/agree', api.agreeWithOpinion);
app.post('/api/opinions/:id/disagree', api.disagreeWithOpinion);


app.listen(4242);