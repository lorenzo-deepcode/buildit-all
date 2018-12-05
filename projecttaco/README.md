# project Taco

[![Build Status](https://travis-ci.org/buildit/projecttaco.svg?branch=master)](https://travis-ci.org/buildit/projecttaco)

### UP & RUNNING
* `npm install`
* `npm start`

### Staging URL
https://project-taco-staging.herokuapp.com

### Production URL
https://project-taco-production.herokuapp.com/#/

### DEPLOYING TO HEROKU
This app is set up for deployment to Heroku!

All you need to do is check code into the repo and the heroku site will build and update.

Heroku will follow the `postinstall` command in your `package.json` and compile assets with `webpack.prod.config.js`. It runs the Express web server in `server.js`. You'll notice there's a special section set up for running in development.

If you've never deployed a Node app to Heroku (or just need a refresher), they have a really great walkthrough [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

### Generatating Javascript docs
`npm run docs`

Once docs have been generated, you can visit [your local server](http://localhost:8080/esdoc) to view them.
