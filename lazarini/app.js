/**
 * Created by jonlazarini on 08/02/17.
 */
const express = require('express');
const path = require('path');

// require('dotenv').config();

const app = express();

// Grab npm_package_version env var from npm when running server script
const PKG_VERSION = process.env.PKG_VERSION;

app.set('port', (process.env.PORT || 5000));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static(path.join(__dirname, `/dist/${PKG_VERSION}`)));

app.get('/', (req, res) => {
  const data = { foo: 'bar' };
  res.render('index', { data });
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

// removed travis CI checking when deploying to heroku to bypass Travis
