const ProcessImagesRequest = require('../extensions/process_images_request');
const updateLocalCache = require('../extensions/updateLocalCache');
const ProcessWhitelistRequest = require('../extensions/process_whitelist_request');
const crypto = require('crypto');

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
            const whiteListHash = crypto.createHash('sha256');
            whiteListHash.update(whitelist.updatedAt.toString());

            res.set({
                'Cache-Control': 'private',
                'ETag': hash.data + whiteListHash.digest('hex').slice(0, 10)
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

exports.getImageData = (req, res, next) => {
    const host = req.query.host;
    ProcessImagesRequest.getImageData(req.query.id)
    .then((image) => {
        return Promise.all([
            Promise.resolve(image),
            ProcessWhitelistRequest.getWhitelistData()
        ]);
    })
    .then(([image, whitelist]) => {
        if (host) {
            if(image.host === host) {
                image = filterImageData(image, whitelist.data);
                res.status(200).send(image);
            } else {
                res.status(404);
            }
        }
    })
    .catch((err) => {
        next(err);
    });
};

const filterImageData = function(image, whitelist) {
    image.facets = filterFacets(image.facets, whitelist);
    const dataToDisplay = filterData(image.data, whitelist);
    dataToDisplay["_id"] = image.data._id;
    dataToDisplay["name"] = image.data.name;
    // temporary hack
    dataToDisplay["largeImage"] = image.data.largeImage;
    image.data = dataToDisplay;
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
    const dataToDisplay = {};
    whitelist.forEach((filter) => {
        if(filter.checked === false) {
            let dataForChecking;
            if(data.hasOwnProperty(filter.value)) {
                dataForChecking = data[filter.value];
            }
            if(Array.isArray(dataForChecking)) {
                filter.data.forEach((item, i) => {
                    if(item.checked) {
                        if(!dataToDisplay.hasOwnProperty(filter.value)) {
                            dataToDisplay[filter.value] = {};
                        }
                        dataToDisplay[filter.value][i] = dataForChecking[i];
                    }
                });
            } else {
                if(dataForChecking && typeof(dataForChecking) === "object" && !Array.isArray(dataForChecking)) {
                    if(filter.data.length > 0) {
                        dataForChecking = filterData(dataForChecking, filter.data);
                    }
                    const checkingDataLength = Object.keys(dataForChecking).length > 0
                        ? Object.keys(dataForChecking).length 
                        : 0;
                    if(checkingDataLength > 0) {
                        dataToDisplay[filter.value] = dataForChecking;
                    }
                }
            } 
        } else if(data.hasOwnProperty(filter.value)) {
            dataToDisplay[filter.value] = data[filter.value];
        }
    });
    return dataToDisplay;
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
