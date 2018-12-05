const fs = require('fs');

module.exports = file => (
  new Promise((resolve, reject) => {
    fs.writeFile(file.filePath, file.data, error => {
      if (error) reject(error);
      resolve();
    });
  })
);
