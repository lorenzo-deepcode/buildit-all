const mkdirp = require('mkdirp');

module.exports = dir => (
  new Promise((resolve, reject) => {
    mkdirp(dir, error => {
      if (error) reject(error);
      resolve(dir);
    });
  })
);
