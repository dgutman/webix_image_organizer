const mongoose = require('mongoose');
const buildQuery = require('../extensions/facet_query_builder');
const fsPromise = require('fs-promise');
const md5 = require('md5-file/promise');

const serviceData = require('./service_data');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

const facetImagesSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    filesrc: {
        type: String
    },
    data: {
        type: Object,
        required: true,
        _id: {
            type: String,
            required: true,
            unique: true
        }
    },
    facets: {
        type: Array,
        required: false
    },
    host: {
        type: String
    }
});

const facetImagesModel = mongoose.model('facet_images', facetImagesSchema);

class FacetImages {
    insertImage(obj, cb) {
        return facetImagesModel.updateOne({"data._id": obj.data._id}, obj, {upsert: true, setDefaultsOnInsert: true})
            .catch((err) => {
                console.error(obj.filename + ': ', err);
            });
    }

    getAll() {
        return facetImagesModel.find({}, {}).lean();
    }

    makeQuery() {
        return this.getAll()
        .then((images) => {
            const convertedImages = this.convertImagesDataForFrontend(images);
            return Promise.resolve(convertedImages);
        });
    }

    saveImagesResponse(images) {
        return fsPromise.writeFile(IMAGES_PATH, JSON.stringify(images))
        .then(() => {
            return md5(IMAGES_PATH);
        })
        .then((hash) => {
            return serviceData.updateImagesHash(hash);
        });
    }

    getAllImages() {
        return fsPromise.access(IMAGES_PATH, (fsPromise.constants || fsPromise).F_OK)
        .then(() => {
            return fsPromise.readFile(IMAGES_PATH);
        });
    }

    convertImagesDataForFrontend(images) {
        const imagesLen = images.length;
        for(let i = 0; i<imagesLen; i++) {
            const t = {};
            const image = images[i];
            const facetsLen = image.facets.length;
            for(let j = 0; j<facetsLen; j++) {
                t[image.facets[j].id] = image.facets[j].value;
            }
            image.facets = t;
        }
        return images;
    }


    getImagesCount(preQuery, cb) {
        const query = buildQuery(preQuery);

        facetImagesModel.find(query).count(function(err, count) {
            cb(count);
        });
    }


    async getImagesFolderIds(host) {
        const folderIds = await facetImagesModel.aggregate([
            {$match: {host}},
            {$group: {
                _id: "$data.folderId"
            }}
        ]);

        return folderIds.map(({_id}) => _id);
    }

    async removeImages(query) {
       const res = await facetImagesModel.deleteMany(query);
       return res.deletedCount;
    }
}

module.exports = new FacetImages();
