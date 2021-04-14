const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const Promise = require('bluebird');

async function createFile(filename, data) {
	return new Promise(function(resolve, reject) {
		const hash = crypto.createHash('sha256');
		hash.update(filename + new Date() + Math.random());
	
		const tmp_dir = path.join(os.tmpdir(), hash.digest('hex'));
	
		fs.writeFile(tmp_dir, data, (err) => {
			if (err) reject(err);

			resolve(tmp_dir);
		});
	})
}

module.exports = createFile;
