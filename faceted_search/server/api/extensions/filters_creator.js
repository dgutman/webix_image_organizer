const is = require('is_js');
const facetFilters = require('../models/facet_filters');
const facetImages = require('../models/facet_images');

// const facetFilters = new FacetFilters();
// const facetImages = new FacetImages();

const prepareQuery = (id, option) => {
    const temp = {};

    if (!temp[id]) {
        temp[id] = option;
    } else if (temp[id] && temp[id] === option) {
        delete temp[id];
    } else {
        if (is.array(temp[id])) {
            temp[id] = temp[id].slice(0);
            const exist = temp[id].some((item) => {
                return item === option;
            });
            if (!exist) {
                temp[id].push(option);
            } else {
                for (let i = 0; i < temp[id].length; i++) {
                    if (temp[id][i] === option) {
                        temp[id].splice(i, 1);
                        break;
                    }
                }
            }
        } else if (is.not.object(temp[id]) && temp[id] !== option) {
            temp[id] = [temp[id], option];
        }
    }

    return temp;
};
const countFacets = (filters) => {
    return new Promise((mainResolve, reject) => {
        const promises = [];
        filters.forEach(function (item, index, filtersArr) {
            filtersArr[index].options.forEach(function (option) {
                const preQuery = prepareQuery(item.id, option);
                promises.push(new Promise((resolve) => {
                    facetImages.getImagesCount(preQuery, (count) => {
                        resolve({index: index, name: option, count: count});
                    });
                }));
            });
        });

        return Promise.all(promises).then((data) => {
            let result = [];
            data.forEach((item) => {
                if (!result[item.index]) {
                    result[item.index] = {};
                    result[item.index].id = filters[item.index].id;
                    result[item.index].name = filters[item.index].name;
                    result[item.index].options = filters[item.index].options;
                    result[item.index].parent = filters[item.index].parent;
                    result[item.index].type = filters[item.index].type;
                }
                if (!result[item.index].count) {
                    result[item.index].count = {};
                }
                result[item.index].count[item.name] = item.count;
            });

            mainResolve(result);
        });
    });
};

function agregateFilters(filters) {
    let result = [], map = {};

    filters.forEach((item) => {
        if (!map.hasOwnProperty(item.parent)) {
            map[item.parent] = result.length;
            result.push({
                "label": item.parent,
                "data": []
            });
        }
        result[map[item.parent]]["data"].push(item);
    });

    return Promise.resolve(result);
}

const facetsCount = (req, res) => {
    facetFilters.getAll()
        // .then((filters) => countFacets(filters))
        .then(agregateFilters)
        .then(
            (filters) => res.status(200).send(filters),
            (err) => res.status(500).send(err)
        );
};

module.exports = facetsCount;
