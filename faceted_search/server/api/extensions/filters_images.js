const facetFilters = require('../models/facet_filters');
const facetImages = require('../models/facet_images');
const constants = require("../../constants");

const getFiltersWithImages = (req, res) => {
    const map = {};
    const result = {
        "filters": {},
        "facets": {

        }
    };
    facetFilters.getAll()
        .then((data) => {
            for(const i of data) {
                result.filters[i.id] = {
                    "name": i.name,
                    "values": i.options,
                    "type": i.type
                };
            }
            return facetImages.getAll();
        })
        .then((images) => {
            for(const i of images) {
                for(const j of i.facets) {
                    if(!result.filters.hasOwnProperty(j.id)) {
                        if(!result.facets.hasOwnProperty(j.id)) {
                            result.facets[j.id] = {
                                "name": j.name,
                                "values": []
                            };
                            map[j.id] = {};
                        }
                        if(j.value && !map[j.id].hasOwnProperty(j.value)) {
                            map[j.id][j.value] = true;
                            if (j.id === constants.CHANNEL_MAP_FILTER) {
                                result.facets[j.id].values = Array
                                    .from(new Set([...result.facets[j.id].values, ...j.value]));
                            } else if (j.value) {
                                result.facets[j.id].values.push(j.value);
                            }
                        }
                        else if (Array.isArray(j.values)) {
                            result.facets[j.id].values = Array.from(
                                new Set([...result.facets[j.id].values, ...j.values])
                            );
                        }
                    }
                }
            }
        })
        .then(()=> res.status(200).send(result))
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
};

module.exports = getFiltersWithImages;
