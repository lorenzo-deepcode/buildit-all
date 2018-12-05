# General Structure (Software) of this app.

Illuminate is a Nodejs app that uses Expressjs to expose a REST based service (that is documented via Swagger).

Illuminate's purpose is to house the logic for extracting and transforming data that will be served to the client by Eolas.  It is separate so that it can change without impact on Eolas.  Change like adding new source systems and algorithms for processing data.  It (will at some point) supports receiving real time updates.


# Structure

index.js loads the routes and then starts listening.

Express routing is accomplished in the routes directory.

- about.js covers ping, deepPing
- processors.js covers all of the generic handling features (logging, errors, CORS, ...).
- v1 supports the routing of most of the direct calls.

The services directory contains the implementations of the callable services.

- about.js - ping implementation and ping/deep structure.  If you add a new dependant service, implement a deepPing function and call it from here.
- errors.js - the generic express error handler functions.
- swaggerDoc.js - serves up the swagger.json file from the 'appropriate' version in teh api_doc directory.
- v# - contains the implementations for the REST resources.

- dataLoader.js - This file is the entry point for processing a project's source systems.
  - processProjectData - Deterimines if the project is configured for demand and/or defect and/or effort.  Configures rules for each, fires off the work and updates the triggering event.
  - processProjectSystem - Common central logic for processing.  The pattern is to:
    - Gather and store the raw information from the source system
    - Convert that to a common format and store that.
    - Generate a summary format that will be served to clients.


- defect.js, demand.js, & effort.js - Generic logic for processing a particular system type.  The goal here is that these files should not change when adding new source systems to process a particular information type.  These all implement the following interface:
  - configureProcessingInstructions - The ProcessingInfo structure contains information about the collections to be used to store the raw, common, and summary data as well as datastore information.
  - rawDataProcessor - This determines which raw data processor implementation to use for collecting the raw data.
  - transformCommonToSummary - Pretty much what it says.


- defectSystem, demandSystem, & effortSystem - These directories contain the application specific logic required to collect their specific information type.  To expand the systems supported by Illuminate, all you should need to do is implement one of these and expand the rawDataProcessor function previously described.  All of the source files in these directories implement the following interface:
    - loadRawData - Interact with the source system to collect the data required.  This function needs to work with both initial load (get it all) and update (changed since 'this' time).  In order for this to work this function _*MUST*_ set a \_id property in its data structure that is unique (or updates just wont work).
    - transformRawToCommon - Pretty much what it says


- dataStore - interfaces for the supported datastore.  To implement a new datastore technology, just implement the methods that exist in mongodb.js and duplicate the functionality of testMongo.js

# API Versioning

API versioning uses a version path in the URL.  Additive changes should not change the API version number (unless you REALLY want to).  To support V2, create a V2 directory in the services directory.  Copy all of the V1 classes and make the necessary changes.  Then create a v2.js in the routes directory and route all calls to those new files.

When and if you get there, you can have a debate.  Do I really need to duplicate all of those files if I am only changing 1 or 2 of them?  No.  Refactor.  Knock yourself out.  Right now this works and is obvious.


# What the heck is this PING and DEEP PING BS

- /ping is a way for the deployed service to let a client know that is loaded and responding.  It also echos its current version and its loaded config data.  Awful handy when someone is telling you that "nothing is working".

- /ping/deep - so /ping responds, but still no data?  /deep "talks" to the datastore and any other external services (think Harvest / project source) to make sure that connection to those services is functioning.

- still not working?  Is there data?  What is your context?


# Convention

- imports / requires are listed in Alpha order
- NPM modules are CamelCase and internal modules are mixedCase
- constants are ALLCAPS (not this call vars as const constants, but real constants)

# Swagger

The Illuminate REST API is documented using Swagger.  See this [link](swagger.md "Swagger documentation generation") below for directions on viewing and maintaining said documentation.


# Dependencies

- body-parser - don't really know why we use this.

- co - is used to support a promised based approach to interacting with mongo.  Because frankly those are the examples provided by the npm project and it just works.

- config - supports the description of configuration information in a JSON format.  Respects the NODE_ENV environment variable to determine which config file to load.

- expressjs - yup, this is an express app.  More on that to come.

- http-status-codes - a good constants library.

- log4js - provides the ability support log levels and log in a common format to a file.  Log files are named eloas.log-MM-DD.  Log format is described in the log4js_config.json file in the config directory.  Log level is controlled in the 'default' config.json file.  There is no purge mechanism, so it is possible to accumulated a year's worth of log files.  Not optimal, but so far not an issue.  Will probably need to change that at some point.  Maybe use some DOW mechanism.

It is often handy to have console logging on when debugging so add the following into the appenders list.
```json
	{
		"type": "console",
		"layout": {
			"type": "pattern",
			"pattern": "%d{ABSOLUTE} %[%-5p%] %c %m"
		}
	}
```
- method-override - allows Eolas to support 'standard' HTTP Method override headers to allow clients to get past firewall restrictions on the use of PUT and DELETE HTTP verbs.  Headers X-HTTP-Method, X-HTTP-Method-Override, and X-Method-Override are supported.

- mongodb - is an npm projec that wraps mongodb.  It is really pretty close to the same as the interface described on the mongodb site.  Sitll I rely on thier documentation when making changes.

Right now the interaction with mongo is spread across several files.  If a change of datastore is contemplated (and it has been), the generic functions should be ported into the mongodb.js file within this project.  Then that file can be 'replaced'.

- ramda - don't you love functional programming?  I don't, but still it is handy from time to time.

- response-time - inserts a header into the response that describes the amount of time the request spent in the server.

- reslter - used to call external systems via their own REST interface.  Currently this is limited to Harvest to support the creation of a new project.  This will likely change as we encounter more systems.  the projectSource section of the config file controls which system to call (think switch statement in availaleProjects.js) and the connection credentials.

- try - This is only used in one place.  Could probably refactor this out.  But it is working so why.

- uuid - generate a GUID for each event.

- valid-url - reg-ex for validating a url.

# Development Dependencies

- chakram - used to support acceptance testing of the Eolas API
- del - used by gulp to clean out the distribution directory
- eslint - code structure enforcment
- gulp - packaging support
- gulp-rename - allows renaming of files.  Used to generate specific config files from templates.
- gulp-template - remember that template bit?  Macro replacement of text in files.
- mocha - unit testing (also used by chakram)
- node-mocks-http - for unit testing express functions
- nsp - node security vulnerabitly testing.  I don't know, sounded good.
- nyc - code coverage metrics
- should - unit testing assertion library
- shrinkwrap - a packaging library that locks down the version of dependacies for packaging.
- sinon - stubbing and mocking framework.  Should probably get rid of this as I can't get it to do what I want.
- sinon-as-promised - allows Sinon to understand resolve and reject.
