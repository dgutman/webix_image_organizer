const facetFiltersModel = require('../models/facet_filters');
const facetImagesModel = require('../models/facet_images');

async function updateFilters() {
    const filters = await facetFiltersModel.getAll();
    const newOptions = {};
    for (const f of filters) {
        newOptions[f.id] = [];
    }
    const images = await facetImagesModel.getAll();
    for (const i of images) {
        for (const f of i.facets) {
            if (newOptions.hasOwnProperty(f.id)) {
                if (Array.isArray(f?.values)) {
                    newOptions[f.id].push(...f.values);
                }
                else {
                    newOptions[f.id].push(f.value);
                }
            }
        }
    }
    const filterIds = Object.keys(newOptions);
    const promises = [];
    for (const i of filterIds) {
        const p = facetFiltersModel.updateByParams(
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

async function getAllFilters() {
    return facetFiltersModel.getAll();
}

module.exports = {
	updateFilters,
    getAllFilters,
};
