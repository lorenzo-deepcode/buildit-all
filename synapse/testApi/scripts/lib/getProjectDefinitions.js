const fs = require('fs');

module.exports = path => (
  new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
      if (error) reject(error);
      resolve(files);
    });
  })
);
