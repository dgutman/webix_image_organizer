const mongoose = require('mongoose');
const constants = require('../../constants');

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
        body.forEach(function(requestItem) {
            return new Promise((resolve) => {
                if (requestItem.status === constants.FILTER_STATUS.ALREADY_ADDED) {
                    return resolve();
                }
                const filters = facetFiltersModel.find({id: requestItem.id});
                if (filters.length) {
                    filters.forEach((item) => {
                        if (
                            requestItem.status === constants.FILTER_STATUS.MODIFIED
                            || requestItem.status === constants.FILTER_STATUS.ADDED
                            || requestItem.status === constants.FILTER_STATUS.REMOVED
                        ) {
                            facetFiltersModel.deleteOne({_id: item._id});
                        }
                    });
                }
                if (
                    requestItem.status === constants.FILTER_STATUS.MODIFIED
                    || requestItem.status === constants.FILTER_STATUS.ADDED
                ) {
                    const doc = new facetFiltersModel(requestItem);
                    doc.save();
                }
            });
        });

        Promise.all(promises).then(() => {
            res.sendStatus(200);
        });
    }

    async getAll() {
        const promise = await facetFiltersModel.find({}).exec();
        return promise;
    }
    

    updateByParams(params, data) {
        return facetFiltersModel.findOneAndUpdate(params, data).exec();
    }

	async deleteAllDocuments() {
		const result = await facetFiltersModel.deleteMany({});
		return result.ok;
	}
}

module.exports = new FacetFilters();
