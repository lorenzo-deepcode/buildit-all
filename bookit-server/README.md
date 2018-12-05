# Bookit server

A server for [Bookit](https://github.com/buildit/bookit-web).

## Quick start
After checkout, this will get you started.

First, make sure the environment configuration is set up correctly. Find the file named `.env-sample`. Copy it and name the new file `.env`. This gives you the minimum environment configuration you need in order to run the app in dev mode.

Then run:
```
npm install
npm run build
npm run server
```

Alternatively, to watch for changes when developing, do the following:

In one terminal:
```
npm run watch
```

And in another:
```
npm run server
```

To watch unit tests while developing, open yet another terminal and run:
```
npm run watch:unit
```

You can check these endpoints, just to make sure everything's working:
 - Room list: `http://localhost:8888/rooms/nyc`
 - Meeting list: `http://localhost:8888/rooms/nyc/meetings?start=2017-03-08&end=2017-03-12`

## Microsoft Azure Setup

[Setting up Microsoft services for Bookit](./docs/setting-up-azure.md)

## Modes of operation

The back end is heavily geared towards testing and stand-alone operation at the moment.  It has a dev mode against an
in-memory generated meeting list, a dev mode against a test Azure AD using the Microsoft Graph API, a unit-test
configuration, and an integration test configuration.  The **default mode of operation is in-memory dev**.  When the
app runs in "in-mem" mode, an `EventGenerator` creates a bunch of sample event data. The events are randomized, so
you will see somewhat different results with every run.


### Accessing additional modes

To work with additional modes, you will need to create a plaintext file named '.env' in the root of your checkout 
defining the following variables.  

##### Toggle usage of the Graph API backend
```
USE_AZURE=true
```

##### MICROSOFT GRAPH SETTINGS
These settings represent the identity that the application will use to access MS Graph API services.

The variable that is used for selecting the identity is called `CLOUD_CONFIG`.  For now, use 'buildit' as the value.
```
CLOUD_CONFIG=buildit
```

There is a secret for each identity that is named `<IDENTITY>_SECRET`.  Once again, for now, use `BUILDIT_SECRET`. Please
 obtain these and other secrets by following the AWS Parameter Store steps below.
```
BUILDIT_SECRET=secret-obtained-from-aws (see below)
```

## Azure administration

If you need to access the administration user and password details for a particular identity, you can get that from AWS as well.  
The parameter names to pull would be `<IDENTITY>_ADMIN_NAME` and `<IDENTITY>_ADMIN_PASSWORD`.  Follow the directions below on
how to get AWS secrets.


## Obtaining Secrets from AWS Parameter Store

We store secrets for the system in AWS' SSM Parameter Store.  It does all the hard work of encrypting our application 
parameters.

"Global" parameters are stored under the `/bookit` namespace.  So global parameter `BAR` is stored at `/bookit/BAR`  
Environment-specific parameters are stored in the `/bookit/<environment>` namespace.  So if the environment is 
`foo`, parameter `BAZ` is stored at `/bookit/foo/BAZ`.

### Get access to AWS
Speak to a fellow developer to obtain AWS keys, which are comprised of a key id and key secret.  After that run:

```
aws configure
```
(_Note:_ Use us-east-1 as your region, when asked, for now.  Note that this can be overridden on the command-line as shown below.)

After this, you should be good to go to run the AWS CLI to pull in environment secrets:

```
$ aws ssm get-parameters --region us-east-1 --name /bookit/<environment>/BUILDIT_SECRET --with-decryption
<<The secret is printed here>>
```
(_Note:_ You can leave out the region parameter if you provided one at configuration time.  The above demonstrates the inclusion
of the region parameter for demonstration purposes).

### Login credentials for sample users

We have two sample users that we can use while developing. Their credentials are stored in the AWS Parameter Store. You can get these credentials with the following:

```
# Admin user
aws ssm get-parameters --region us-east-1 --name /bookit/BUILDIT_ADMIN_NAME /bookit/BUILDIT_ADMIN_PASSWORD --with-decryption 

# Regular user
aws ssm get-parameters --region us-east-1 --name /bookit/BUILDIT_REGULAR_USER_NAME /bookit/BUILDIT_REGULAR_USER_PASSWORD --with-decryption 
```


## Authentication
There are a few endpoints that require a token in order to access.  It's either because it needs
to be protected or because it is user-context sensitive.  The server has an endpoint for retrieving a token for using
in some subsequent requests.  Send a json object that conforms to the below interface.

```
POST /authenticate

export interface Credentials {
  user: string;
  password: string;
}
```
You will get back an object that has a member called 'token.'  The token is hardcoded to last 60 minutes at the moment.

```
export interface TokenInfo {
  user: string;
  password: string;
  iat: number;
  exp: number;
}
```

This token should be placed in the header for authentication for those endpoints that require it.
````
return request(app).get('/backdoor')
                  .set('x-access-token', token)
                  .expect(200)
````

## Code architecture
The environment bootstrapping is simple and is mainly driven off the two environment variables above.  This can be
found under src/config.  The environment loading code is in env.ts.  The config is loaded using
 [node-config](https://github.com/lorenwest/node-config).

The run-time configuration is generated in src/config/runtime.  The creation of all services is
done in configuration.ts.  There are interfaces for each service and mainly two implementations.
One is Mock and the other is MSGraph.

## Services
There are a small set of services under which the code is organized under src/services.  

##### Mock
A version that implements the interface and has basic or pass-through functionality.  Sometimes these implementations imitate Microsoft's idiosyncracies like the PassthroughMeetingService in CachedMeetingService.

##### MS Graph
These are the services that connect to Microsoft.

##### Cached
Wraps the service and caches data from the underlying service.  This is typically used with the cloud connected
services.  However, for testing purposes, there is a use case where a cached service functions as
the actual service and delegates to a pass-through service.


#### TokenOperations
This is a class the provides two types of tokens.  The first are JWT tokens for protected endpoints.  The second
are cloud tokens for MS Graph calls.

#### RoomService
This service provides room lists for a particular location (e.g. for NYC or Copenhagen).

Our data store, Microsoft Azure AD, has no notion of a "room" or a "room list", so we decided to store the room list as a "Group" in Microsoft Azure. When setting up a new location, the Bookit administrator works with the Azure AD administrator to create a new group, populated with a list of rooms for that location.

#### UserService
This service provides a user list.

#### MeetingService
This service is the main service of the application that does CRUD meeting operations.

## REST
The app is using express for its web server.  There are three endpoint categories:

##### Test
For test routes to see if the server is up.

##### Authentication
To set up the login routes

##### Meetings
The routes for CRUD meeting operations that bookit-web interacts with.

## Special cases
MeetingOps seems to be an IOC class meant for reusing logic (e.g. checking for meeting availability) against an
interchangeable set of services.  This class is actively being gutted as it's not maintainting any state nor representing
an interface of much value.

## Useful links

[Office Portal](https://portal.office.com/) (resource management)

[Azure Portal](https://portal.azure.com) (application management)

[Node.js Graph API](https://github.com/microsoftgraph/msgraph-sdk-javascript)

[Calendar REST API reference](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/resources/calendar)  

[Microsoft Graph API permissins list](https://developer.microsoft.com/en-us/graph/docs/authorization/permission_scopes)

## Docker packaging

The Travis build pushes to Amazon's EC2 Container Registry (ECR) only for the `master` branch.
We do not perform separate `npm i` and reuse build `node_modules` with `npm prune --production`.

## Local Docker, Server Only
Local build and run example:

`docker build . -t bookit-server:local && USE_CLOUD=true CLOUD_CONFIG=buildit BUILDIT_SECRET=<secret from above> docker run --rm -ti -p 8888:8888  bookit-server:local`


## Local Docker, both Server & Web (Experimental)
This is close, but needs a bit more work.  It's sensitive to the Azure AD setup du jour.
```
$(aws ecr get-login)
docker-compose up
```
(if the basic ECR login above doesn't work, try `$(aws ecr get-login | sed 's/-e none//')`)

## CI/CD
On commits to `master`, if all unit tests pass, Travis creates a new Docker image and pushes it to an AWS ECR repo. 
After a successful push to ECR, the app is deployed to the integration environment. Then Integration tests are 
run. Only if the integration tests run successfully, does Travis then deploy the app to the staging environment.

Note that this process is currently a little odd.  The "integration tests" are tests that assume availability of the 
Office365/GraphApi services.  There currently are no API-level tests of the deployed bookit-server itself.  Thus,
having passed integration tests does not truly imply that the deployed code has been tested in the integration
environment.  Nonetheless, if the integration tests pass, the code is deployed into the staging environment.  
