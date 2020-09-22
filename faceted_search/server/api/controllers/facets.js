const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');
const ProcessImagesRequest = require('../extensions/process_images_request');
const updateLocalCache = require('../extensions/updateLocalCache');

exports.getImagesData = (req, res, next) => {
    const host = req.query.host;
    const clientHash = req.get('If-None-Match');
    ProcessImagesRequest.getImagesData(clientHash, host)
    .then(([hash, images]) => {
        if(hash){
            res.set({
                'Cache-Control': 'private',
                'ETag': hash.data
            });
            if (host) {
                images = JSON.parse(images).filter(obj => obj.host === host);
            }
            res.status(200).send(images);
        } else {
            res.status(304).send();
        }
    })
    .catch((err) => {
        if(err.code === 'ENOENT'){
            res.status(200).send({});
        } else {
            next(err);
        }
    });
}

exports.updateCache = (req, res, next) => {
    updateLocalCache()
    .then((result) => {
        console.log(result);
        res.status(200).send({'status':result});
    })
    .catch((err) => {
        res.status(500).send({'status':'server error'});
    })
}