const facetFilters = require('../models/facet_filters');
const facetImages = require('../models/facet_images');

async function updateFilters() {
    const filters = await facetFilters.getAll();
    const newOptions = {};
    for (const f of filters) {
        newOptions[f.id] = [];
    }
    const images = await facetImages.getAll();
    for (const i of images) {
        for (const f of i.facets) {
            if (newOptions.hasOwnProperty(f.id)) {
                newOptions[f.id].push(f.value);
            }
        }
    }
    const filterIds = Object.keys(newOptions);
    const promises = [];
    for (const i of filterIds) {
        const p = facetFilters.updateByParams(
            {
                id: i
            },
            {
                options: Array.from(new Set([...newOptions[i]]))
            }
        );
        promises.push(p);
    }
    await Promise.all(promises);
}

module.exports = {
	updateFilters
};
