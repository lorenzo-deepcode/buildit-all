# illuminate
 verb | il·lu·mi·nate | \-ˌnāt\

To make (something) clearer and easier to understand

## PURPOSE

This project is a Nodejs / Expressjs based REST service primarily used to facilitate the transform of various bits of demand, defect, effort, or other such project related data from a source system format into a more summarized form so that it can be served to various clients by the MI REST service Eolas.

It is part of the Buildit Management Information Utilities.

illuminate can be configured / will be configurable to:

- consume the entire history of a project (initial import) on demand.
- retrieve updated data from the end of a previous run (again on demand).
- schedule a time to execute an initial import
- schedule a time to execute an updated
- recieve real-time updates from a source system

## INSTALLATION

Eolas requires the installation of NPM prior to doing any work.  [See the NPM site for installation instructions](npmjs.com "NPM installtion")

The Eolas service also requires a data store. At this time that is MongoDB.
Please install, configure, and have it running prior to using this app.  See MongoDB installation hints [here](mongodb.md "Mongo DB installtion instructions")

Once installed you can use the `datastore.dbUrl` property defined in the `config/development.json` file to point to your installation.

The `datastore.context` property defined in the `config/development.json` file is used to allow users / installs to share a common mongo instance and still maintain separate data.  Yes it is a bit of a hack, but it works.

Prior to using or developing run the command below to load all node.js requirements

```sh
$ npm install
```

## USAGE

### Serve data
Edit `config/development.json` to change the port on which the server listens.

To start the REST server:
```sh
$ npm run start
```
Other useful commands (like always run these prior to checkin!)

| cli                 | purpose                                                             |
|---------------------|---------------------------------------------------------------------|
| `npm run lint`      | Run ESLint on all project .js files                                 |
| `npm run security`  | Run node security check                                             |
| `npm run test`      | Run unit tests (mocha)                                              |
| `npm run validate`  | Run all of the above                                                |
| `npm run accept`    | Run acceptance tests (chakram) - requires the server to be running  |

## DEVELOPMENT

[For discussion on the structure of this project](structure.md "Illuminate structure").

## Swagger API
Illuminates REST API is documented using Swagger.  For information on how to view and edit that information look [here](swagger.md "Swagger documentation generation").
