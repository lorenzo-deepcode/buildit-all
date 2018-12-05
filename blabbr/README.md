# Blabbr

A simple API to store and retrieve comments from a Firebase database.
 
## Getting started

### Pre-requisites
- Node v7+
- You'll also need to create a project in Firebase and get the API
  key. [Sign up for a free account](https://www.firebase.com/login/). 

### To run
- Clone this repo and 'npm install' dependencies.
- Enter your API details from Firebase DB settings into the config.json file. To ensure that you don't accidentally commit your config.json to Github,
  run:
  
  ```
  git update-index --assume-unchanged config.json
  ```
- Change the 'Rules' in your Firebase 'Database' -> 'Rules' to allow read and write access without authentication e.g.
 ```
 {
   "rules": {
     ".read": "true",
     ".write": "true"
   }
 }
```
- Type 'npm start'

The project will fire up a server hosted on port 3000 (default - can be changed in the config).

## Development

To run the project in development mode:

- Type 'npm run dev'

This will fire up 'nodemon' to watch for changes and use 'babel-node' for on the fly transpilation.

## Adding a comment

Create a 'POST' request to http://localhost:3000/[COMPONENTID] with the following JSON as you body e.g. :

```
{
	"userName": "Jack",
	"userEmail": "jack.smith@wipro.com",
	"comment": "Looks good - approved!",
	"stateId": "default",
	"version": "0_0_1"
}
```

If the POST was successfull you'll recieve the following JSON back:
```
{
  "success": 1,
  "comment": {
    "userName": "Jack",
    "userEmail": "jack.smith@wipro.com",
    "componentId": "dropdown",
    "comment": "Looks good - approved!",
    "timestamp": 1484749828849,
    "stateId": "default",
    "version": "0_0_1"
  }
}
```

## Retrieving a comment

Create a 'GET' request to:
```
 http://localhost:3000/[COMPONENTID] 
 OR
 http://localhost:3000/[COMPONENTID]/[STATEID]
 OR
 http://localhost:3000/[COMPONENTID]/[STATEID]/[VERSION]
```

Here's a sample of the data that would be returned

```
{
  "success": 1,
  "comments": [
    {
      "id": ""-KalyE-fFQifQwUpTrRl",
      "comment": "New update added",
      "componentId": "dropdown",
      "timestamp": 1484749598756,
      "userEmail": "jack.smith@wipro.com",
      "userName": "Jack",
      "stateId": "default",
      "version": "0_0_1"
    },
    {
      "id": "-Kalz6AsIqNyH6zc-20X",
      "comment": "New update added",
      "componentId": "dropdown",
      "timestamp": 1484749828849,
      "userEmail": "jack.smith@wipro.com",
      "userName": "Jack",
      "stateId": "default",
      "version": "0_0_1"
    }
  ]
}

```
## Delete a comment

Create a 'DELETE' request with the component id and comment id e.g.
 
```
    http://localhost:3000/[COMPONENTID]/[COMMENTID]
```

## Edit a comment

Create a 'PUT' request with the component id and comment id e.g.
 
```
    http://localhost:3000/[COMPONENTID]/[COMMENTID]
```

and send through the following JSON in the body:
```
    {
        "comment": "Newly updated comment"
    }
```

# Client side
## Setup
Install the firebase package, saving it as a project dependency:
```
npm install -S firebase
```
Create a new file (e.g. db.js) with the following code:
```
import * as firebase from "firebase";

var config = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  storageBucket: "<BUCKET>.appspot.com",
};
firebase.initializeApp(config);

var db = firebase.database();
export default db;
```

## Listening to database events 
Example
```
import db from './db';
var commentsRef = db.ref('post-comments/' + postId);
commentsRef.on('child_added', function(data) {
  addCommentElement(postElement, data.key, data.val().text, data.val().author);
});

commentsRef.on('child_changed', function(data) {
  setCommentValues(postElement, data.key, data.val().text, data.val().author);
});

commentsRef.on('child_removed', function(data) {
  deleteComment(postElement, data.key);
});
```

### Notes:

- comments are sorted by timestamp in descending order (last comment added will be first returned)

## TODO
- Authentication