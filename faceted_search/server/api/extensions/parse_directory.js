const fs = require('fs');
const path = require('path');

const parse = (arr, dir, folder) => {
    const parse_path = path.join(dir, folder);
    const files = fs.readdirSync(parse_path);

    if (
        // in final folder there are only two files
    files.length === 2
    // and they both have identical name
    && path.parse(files[0]).name == path.parse(files[1]).name
    ) {
        arr.push(parse_path);
        return arr;
    } else if(path.extname(files[0]) === ".json"){// check if we have only json
        arr.push(parse_path);
        return arr;
    } else {
        // in this case we have folder full of folders
        files.forEach(function (item) {
            arr = parse(arr, parse_path, item);
        });

        return arr;
    }
};

const parseDirectory = (dir, message) => {
    message('[Directory]: starting parse directory');
    return Promise.resolve(parse([], dir, ''))
        .then(function (arr) {
            message('[Directory]: finished');

            return Promise.resolve(arr);
        });
};

module.exports = parseDirectory;
