const serviceData = require('../models/service_data');
const facetImages = require('../models/facet_images');
const whitelistModel = require('../models/whitelist');
const md5 = require('md5-file/promise');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

class ProcessImagesRequest {

    checkEtag(clientHash) {
        let promise;
        if(clientHash){
            return Promise.all([
                serviceData.getImagesHash(),
                whitelistModel.getWhitelistId()
            ])
            .then(([hashObj, whitelistId]) => {
                let promise;
                if(!hashObj){
                    promise = Promise.reject({code: 'ENOENT'});
                } else if(clientHash === hashObj.data + whitelistId){
                    promise = Promise.resolve(true);
                } else {
                    promise = Promise.resolve(false);
                }
                return promise;
            });
        } else {
            promise = Promise.resolve(false);
        }
        return promise;
    }

    getImagesData(clientHash) {
        return this.checkEtag(clientHash)
        .then((result) => {
            let promise;
            if(result){
                promise =  Promise.resolve(null);
            } else {
                promise =  facetImages.getAllImages();
            }
            return promise;
        })
        .then((images) => {
            let promise;
            if(images){
                let promises = [];
                promises.push(serviceData.getImagesHash());
                promises.push(Promise.resolve(images));
                promise =  Promise.all(promises);
            } else {
                promise =  Promise.resolve([null, null]);
            }
            return promise;
        })
    }

}

module.exports = new ProcessImagesRequest();