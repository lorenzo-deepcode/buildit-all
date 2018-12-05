// Set up Firebase
import * as firebase from "firebase";
var config = require('../config.json');

firebase.initializeApp(config);

export default firebase;