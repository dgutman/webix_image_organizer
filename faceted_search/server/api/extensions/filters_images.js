const is = require('is_js');
const facetFilters = require('../models/facet_filters');
const facetImages = require('../models/facet_images');

// const facetFilters = new FacetFilters();
// const facetImages = new FacetImages();


const getFiltersWithImages = (req, res) => {
    let map = {};
    let result = {
        "filters": {},
        "facets": {

        }
    };
    facetFilters.getAll()
        .then((data) => {
            for(let i of data) {
                result.filters[i.id] = {
                    "name": i.name,
                    "values": i.options,
                    "type": i.type
                }
            }
            return facetImages.getAll();
        })
        .then((images) => {
            for(let i of images) {
                for(let j of i.facets) {
                    if(!result.filters.hasOwnProperty(j.id)) {
                        if(!result.facets.hasOwnProperty(j.id)) {
                            result.facets[j.id] = {
                                "name": j.name,
                                "values": []
                            };
                            map[j.id] = {};
                        }
                        if(!map[j.id].hasOwnProperty(j.value)) {
                            map[j.id][j.value] = true;
                            result.facets[j.id].values.push(j.value);
                        }
                    }
                }
            }
        })
        .then(()=> res.status(200).send(result))
        .catch((err) => res.status(500).send(err))
};

module.exports = getFiltersWithImages;