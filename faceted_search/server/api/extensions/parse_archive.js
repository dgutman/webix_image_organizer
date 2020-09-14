const fs = require('fs');
const crypto = require('crypto');
const tarGz = require('tar.gz');
const path = require('path');
const archive_upload_path = require('../../../config').archive_upload_path;

const parseArchive = (filename, message) => {
    message('[Archive]: starting extraction');

    return new Promise(function (resolve, reject) {
        const path_to_archive = path.join(archive_upload_path, 'archive', filename);

        if (fs.existsSync(path_to_archive)) {
            let path_to_extract_folder;

            {
                const hash = crypto.createHash('sha256');
                hash.update(filename + new Date() + Math.random());

                path_to_extract_folder = path.join(archive_upload_path, 'extract', hash.digest('hex').slice(0, 10));
            }

            fs.mkdirSync(path_to_extract_folder);

            tarGz().extract(path_to_archive, path_to_extract_folder)
                .then(() => {
                    fs.unlink(path_to_archive, function () {
                        message('[Archive]: archive is deleted');
                    });
                    message('[Archive]: ' + path_to_extract_folder);
                    message('[Archive]: done extraction');
                    resolve(path_to_extract_folder);
                })
                .catch((err) => {
                    reject(err);
                });
        } else reject("NO Archive: " + path_to_archive);
    });
};

module.exports = parseArchive;
