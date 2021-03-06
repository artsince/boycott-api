# BOYCOTT API for Node.js

This is a RESTful API for Node.js (version >=0.10.x) as an attempt to create a crowdsourced database for boycotted venues, corporations, organizations, events, etc.

Currently in BETA phase, therefore data collection hasn't officially begun. However, the latest version of the API is deployed on [http://boycott-api.herokuapp.com](http://boycott-api.herokuapp.com).

## Installation and Configuration
Clone Boycott API from the GitHub [repository](https://github.com/artsince/boycott-api.git)
```sh
git clone https://github.com/artsince/boycott-api.git
```

All required external modules are alrady specified in package.json file. To install dependencies run:
```sh
npm install
```

Boycott API uses MongoDB for storing data. The connection parameters for the database are kept under the config folder. Depending on the ```process.env.NODE_ENV``` value, the config parameters are retrieved from the the corresponding ```config.(env).js``` file. If no parameter set development is assumed.```config.heroku.js``` file is used on heroku, and filled out on deployment.


## Running Tests
Boycott API uses mocha for testing. Test files are kept in the test folder, and test subjects (i.e. API endpoint) are separated in different files for convenience. An active MongoDB connection is required for successful testing. The test config parameters are given in [config.test.js](https://github.com/artsince/boycott-api/blob/master/config/config.test.js) file.

To run tests:
```sh
npm tests
```
## Running And Usage
To run the program:
```sh
node app.js
```

The app will run on port 4242, and default index file can be reached on that port. Queries can be sent either from the browser with, for example, Developer Console on Chrome, or with curl.

To add a new venue on Developer Console: 
```js
jQuery.post("/api/venues/add", { 
    name: "Starbucks", 
    foursquare_id: "4bcafe7a3740b71323a06165", 
    location: [28.986557810839557, 41.04188709438886]
}, function(data, status, jqXHR) { 
    console.dir(data); 
});
```
Or with curl (on Windows):
```sh
curl -H "Content-Type: application/json" -X POST http://localhost:4242/api/venues/add -d "{ \"name\": \Starbucks\, \"foursquare_id\": \"4bcafe7a3740b71323a06165\", \"location\": [28.986557810839557, 41.04188709438886]}"
``` 


The JSON response will be:

```json
{
  "name": "Starbucks",
  "foursquare_id": "4bcafe7a3740b71323a06165",
  "veto_count": 0,
  "approve_count": 0,
  "location": [
    28.986557810839557,
    41.04188709438886
  ],
  "id": "51f051f6148d77bc1e000001"
}
``` 

To list all venues on Developer Console:

```js
jQuery.post("/api/venues", function(data, status, jqXHR) { 
    console.dir(data); 
});
``` 

Or with curl (on Windows):
```sh
curl -X GET -H "Content-Type: application/json" http://localhost:4242/api/venues
``` 
The response will of JSON Array type.


## Reference
Each venue contains a name, geographical coordinates, and a unique Foursquare Id. Users may approve or veto a boycott on a venue with an optional comment. Total number of upvotes and downvotes are stored with the venue as ``` approve_count ``` and ``` veto_count ```.

User comments are stored as Opinions. Opinions contain a logical link to the related venue via ```boycott_id```. Users can agree or disagree with opinions. Total number of upvotes and downvotes are stored with the opinion as ```agree_count``` and ```disagree_count```.

The following endpoints are defined so far:
* ```GET /api/venues``` Lists all venues.

     __limit__: maximum number of results to return. _(optional, default: 20)_

     __max_date__: earliest insertion date for record. useful for pagination._(optional)_
* ```POST /api/venues/add``` Adds a new venue.

    __name__: the name of the venue _(required)_

    __foursquare_id__: unique foursquare id for the venue. _(required, unique)_
    
    __location__: longitude and latitude of the venue _(required, [lng, lat])_

* ```GET /api/venues/:id``` Shows a venue by id.
* ```POST /api/venues/approve```Approve/support the boycott.
    
    __id__: unique id for the venue _(required)_
    
    __opinion__: accompanying comment to approve boycott _(optional)_
* ```POST /api/venues/veto``` Veto/reject/disagree with the boycott. 
    
    __id__: unique id for the venue _(required)_
    
    __opinion__: accompanying comment to veto boycott _(optional)_
* ```POST /api/opinions/:id/agree``` Agree with the comment on the boycott.
* ```POST /api/opinions/:id/disagree``` Disagree with the comment on the boycott.
* ```GET /api/opinions``` List all opinions.

     __limit__: maximum number of results to return. _(optional, default: 20)_

     __max_date__: earliest insertion date for record. useful for pagination._(optional)_
* ```GET '/api/search/venues``` Search for boycotted venues.

    __radius__: radius of the search regions _(optional, default: 500m)_

    __lat__: latitude of the search center _(required along with lng)_

    __lng__: longitude of the search center _(required along with lat)_

    __limit__: maximum number of results to return. _(optional, default: 20)_

    __max_date__: earliest insertion date for record. useful for pagination._(optional)_

Currently, there is neither an authentication mechanism nor the ability to delete venues/opinions. Those features, and others, might come to life in the future.

More details will be added soon, in the meantime you can read the source code.

## Contribute
This is an open source project. Feel free to fork the project, report issues, and give feedback.