const is = require('is_js');
const _ = require('lodash');
const {CHANNEL_MAP_FILTER, CHANNEL_MAP_FIELD} = require('../../constants');
const facetFilters = require("../models/facet_filters");

// unconcat
const build = (facets, prefix, obj) => {
    if (prefix === CHANNEL_MAP_FILTER) {
        facets.push({
            id: prefix,
            name: CHANNEL_MAP_FIELD,
            value: Object.keys(obj)
        });
    }

    if (prefix !== "") {
        prefix += '|';
    }

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (obj.hasOwnProperty(key)) {
            if (is.not.object(obj[key])) {
                let value = obj[key];

                if (
                    (is.string(value) && value.trim === "")
                    || (!value && !is.boolean(value))
                ) {
                    value = "no value";
                } else if (is.boolean(value)) {
                    value = value + "";
                }
                // add element to facets, name is for backend ui,
                // type & value is for facet mongo
                facets.push(
                    {
                        id: prefix + key,
                        name: key,
                        value
                    }
                );
            } else {
                facets = build(facets, prefix + key, obj[key]);
            }
        }
    }

    return facets;
};

const facets = (obj) => {
    return build([], '', obj);
};

const filters = (filter, obj) => {
    let item;
    for (let i = 0; i < obj.length; i++) {
        item = obj[i];

        if (filter[item.id]) {
            filter[item.id].values.push(item.value);
        } else {
            filter[item.id] = {
                name: item.name,
                values: [item.value]
            };
        }
    }

    return filter;
};

const uniqFilter = (filter) => {
    return new Promise((mainResolve, mainReject) => {
        facetFilters
            .getAll()
            .then((filtersDocuments) => {
                const filterKeys = Object.keys(filter);
                const map = {};
                for(const j of filtersDocuments) {
                    map[j.id] = {
                        data: j
                    };
                }
                filterKeys.forEach((key) => {
                    if (filter.hasOwnProperty(key)) {
                        if(map.hasOwnProperty(key)) {
                            map[key].data.options = filter[key].values;
                            map[key].data.options.concat(filter[key].values);
                            map[key].data.options = _.uniq(map[key].data.options);
                            map[key].data.options.sort();
                            delete filter[key];
                        } else {
                            filter[key].values = _.uniq(filter[key].values);
                            filter[key].values.sort();
                        }
                    }
                });
                for(const key in map) {
                    if(map && map.hasOwnProperty(key)) {
                        facetFilters
                            .updateByParams({"_id": map[key].data._id}, map[key].data);
                    }
                }
                mainResolve(filter);
            });
    });
};

module.exports = {facets, filters, uniqFilter};
