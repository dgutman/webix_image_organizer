const mongoose = require('mongoose');

const facetFiltersSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    }
});

const facetFiltersModel = mongoose.model('facet_filters', facetFiltersSchema);

class FacetFilters {
    addFilters(req, res) {
        const body = JSON.parse(req.body.data);
        const promises = [];
        body.forEach(function (requestItem) {
            return new Promise((resolve) => {
                if (requestItem.status === "already_added") {
                    return resolve();
                }
                facetFiltersModel.find({id: requestItem.id}, (err, filters) => {
                    if (filters.length) {
                        filters.forEach((item) => {
                            if (requestItem.status === "modified" || requestItem.status === "added" || requestItem.status === "removed") {
                                facetFiltersModel.remove({_id: item._id}, function (err) {
                                    if (err) return handleError(err);
                                    // removed!
                                });
                            }
                        });
                    }
                    if (requestItem.status === "modified" || requestItem.status === "added") {
                        const model = new facetFiltersModel(requestItem);
                        model.save(() => {
                            resolve();
                        });
                    }
                });
            });
        });

        Promise.all(promises).then(() => {
            res.sendStatus(200);
        });
    }

    getAll() {
        return new Promise(
            (resolve, reject) => {
                facetFiltersModel
                    .find({},
                        (err, filters) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(filters);
                            }
                        });
            });
    }
    

    updateByParams(params, data) {
        return new Promise(
            (resolve, reject) => {
                facetFiltersModel
                    .findOneAndUpdate(
                        params,
                        data,
                        (err, filters) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(filters);
                            }
                        });
            });
    }
}

module.exports = new FacetFilters();
