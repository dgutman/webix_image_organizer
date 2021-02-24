const crypto = require('crypto');
const mv = require('mv');
const fs = require('fs');
const archive_upload_path = require('../../../config').archive_upload_path;
const path = require('path');

function moveToPath(filename) {
  const hash = crypto.createHash('sha256');
  hash.update(filename + new Date() + Math.random());
  const archive_path = path.join(archive_upload_path, 'json');
  if (!fs.existsSync(archive_path)) {
    fs.mkdirSync(archive_path); 
  }
  const archive_name = hash.digest('hex').slice(0, 10) + filename;

  return path.join(archive_path, archive_name);
};

const moveTo = (from, filename) => {
  return new Promise(function(resolve, reject) {
    const pathTo = moveToPath(filename);

    mv(from, pathTo, function(err) {
      if (err) {
        reject(err);
      }
      else {
        resolve(path.basename(pathTo));
      }
    });
  });
};

module.exports = moveTo;
