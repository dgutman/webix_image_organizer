const is = require('is_js');
const _ = require('lodash');
const facetFilters = require("../models/facet_filters");

// unconcat
const build = (facets, prefix, obj) => {
    if (prefix !== "") {
        prefix += '|';
    }

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
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
                let keys = Object.keys(filter), key,
                    map = {};
                for(let j of filtersDocuments) {
                    map[j.id] = {
                        data: j
                    }
                }
                for (let i = 0; i < keys.length; i++) {
                    if (filter.hasOwnProperty(keys[i])) {
                        if(map.hasOwnProperty(keys[i])) {
                            map[keys[i]].data.options.concat(filter[keys[i]].values);
                            map[keys[i]].data.options = _.uniq(map[keys[i]].data.options);
                            map[keys[i]].data.options.sort();
                            delete filter[keys[i]];
                        } else {
                            filter[keys[i]].values = _.uniq(filter[keys[i]].values);
                            filter[keys[i]].values.sort();
                        }
                    }
                }
                for(key in map) {
                    if(map && map.hasOwnProperty(key)) {
                        facetFilters
                            .updateByParams({"_id": map[key].data._id}, map[key].data)
                    }
                }

                mainResolve(filter);
            });
    });
};

module.exports = {facets, filters, uniqFilter};