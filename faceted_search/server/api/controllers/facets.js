const ProcessImagesRequest = require('../extensions/process_images_request');
const updateLocalCache = require('../extensions/updateLocalCache');
const ProcessWhitelistRequest = require('../extensions/process_whitelist_request');

exports.getImagesData = (req, res, next) => {
    const host = req.query.host;
    const clientHash = req.get('If-None-Match');
    ProcessImagesRequest.getImagesData(clientHash, host)
    .then(([hash, images]) => {
        return Promise.all([
            Promise.resolve(hash),
            Promise.resolve(images),
            ProcessWhitelistRequest.getWhitelistData()
        ]);
    })
    .then(([hash, images, whitelist]) => {
        if(hash) {
            res.set({
                'Cache-Control': 'private',
                'ETag': hash.data + whitelist.id
            });
            if (host) {
                   images = JSON.parse(images).filter((obj) => obj.host === host);
               }
            images.forEach((image) => {
                image = filterImageData(image, whitelist.data);
            });
            res.status(200).send(images);
        } else {
            res.status(304).send();
        }
    })
    .catch((err) => {
        if(err.code === 'ENOENT') {
            res.status(200).send({});
        } else {
            next(err);
        }
    });
};

const filterImageData = function(image, whitelist) {
    image.facets = filterFacets(image.facets, whitelist);
    image.data = filterData(image.data, whitelist);
    return image;
};

const filterFacets = function(facets, whitelist) {
    whitelist.forEach((filter) => {
        if(filter.checked === false) {
            delete(facets[filter.id]);
        }
        if(filter.data.length !== 0) {
            facets = filterFacets(facets, filter.data);
        }
    });
    return facets;
};

const filterData = function(data, whitelist) {
    whitelist.forEach((filter) => {
        if(filter.checked === false) {
            let dataForChecking;
            if(data.hasOwnProperty(filter.value)) {
                dataForChecking = data[filter.value];
            }
            if(Array.isArray(dataForChecking)) {
                delete(data[filter.value]);
            } else if(dataForChecking && typeof(dataForChecking) === "object") {
                if(filter.data.length > 0) {
                    dataForChecking = filterData(data[filter.value], filter.data);
                }
                let checkingDataLength = Object.keys(dataForChecking).length ? Object.keys(dataForChecking).length : 0;
                if(checkingDataLength === 0) {
                    delete(data[filter.value]);
                }
            } else {
                delete(data[filter.value]);
            }
        }
    });
    return data;
};

exports.updateCache = (req, res, next) => {
    updateLocalCache()
    .then((result) => {
        console.log(result);
        res.status(200).send({'status': result});
    })
    .catch((err) => {
        res.status(500).send({'status': 'server error'});
    });
};
