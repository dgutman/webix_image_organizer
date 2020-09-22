const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const Promise = require('bluebird');

function save_file(stream, filename) {
 return new Promise(function(resolve, reject) {
   const hash = crypto.createHash('sha256');
   hash.update(filename + new Date() + Math.random());

   const tmp_dir = path.join(os.tmpdir(), hash.digest('hex'));
   const fileStream = fs.createWriteStream(tmp_dir);

   stream.on('data', function(data) {
     fileStream.write(data);
   });

   stream.on('error', function(err) {
     console.error(err);
     reject(err);
   });

   stream.on('end', function() {
     fileStream.end();
     resolve(tmp_dir);
   });
 });
}

module.exports = save_file;
