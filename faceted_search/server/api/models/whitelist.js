const mongoose = require('mongoose');
const facetImages = require('../models/facet_images');

const whitelistSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true
    }
},
{timestamps: true});

const whitelistModel = mongoose.model('whitelist', whitelistSchema);

class Whitelist {
    getWhitelistData() {
        return new Promise(
            (resolve, reject) => {
                whitelistModel.findOne({},
                    (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            if(result) {
                                resolve(result.data);
                            } else {
                                resolve('');
                            }
                        }
                    });
            });
    }

    getWhitelist() {
        return whitelistModel.findOne({});
    }

    getWhitelistFilter() {
        return new Promise(
            (resolve, reject) => {
                whitelistModel.findOne({},
                    (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            if(result) {
                                resolve([result.data, result._id.toString()]);
                            } else {
                                resolve(['', '']);
                            }
                        }
                    });
            });
    }

    getWhitelistId() {
        return new Promise(
            (resolve, reject) => {
                whitelistModel.findOne({},
                    (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            if(result) {
                                resolve(result._id.toString());
                            } else {
                                resolve('');
                            }
                        }
                    });
            }
        );
    }

    updateWhitelist(valuesForUpdate) {
        return this.getWhitelistData()
            .then((data) => {
                if(data) {
                    return whitelistModel.deleteOne({})
                        .then((result) => {
                            const newData = this.checkItems(data, valuesForUpdate);
                            if(result) {
                                const data = this.insert(newData);
                                return data;
                            }
                        });
                }
            });
    }

    checkItems(data, valuesForUpdate) {
        if(valuesForUpdate) {
            data.map((element) => {
                const valuesForUpdateItem = valuesForUpdate.find((item) => {
                    return item.id === element.id;
                });
                if(valuesForUpdateItem) {
                    element.checked = valuesForUpdateItem.checked;
                    if(element.data.length > 0) {
                        element.data = this.checkItems(element.data, valuesForUpdateItem.data);
                    }
                }
                return element;
            });
        }
        return data;
    }

    async insert(newData) {
        const doc = new whitelistModel({
            data: newData
        });
        const savedData = await doc.save();
        return savedData;
    }

    initialWhitelist() {
        return new Promise((resolve, reject) => {
            facetImages.getAll()
            .then((images) => {
                if(images.length !== 0) {
                    return this.getFacetesFromImagesData(images);
                } else {
                    resolve();
                }
            })
            .then((facets) => {
                if(facets) {
                    return this.getData(facets);
                }
            })
            .then((whitelist) => {
                if(whitelist) {
                    const data = this.insert(whitelist);
                    resolve(data);
                } else {
                    const array = [];
                    const data = this.insert(array);
                    resolve(data);
                }
            })
            .catch((reason) => {
                reject(reason);
            });
        });        
    }

    async insertItems(image) {
        const facets = this.getFacetesFromImagesData([image]);
        const data = this.getData(facets);
        let [whitelist, whitelistId] = await this.getWhitelistFilter();
        whitelist = this.updateWhitelistItems(data, whitelist);
        await whitelistModel.updateOne({_id: whitelistId}, {data: whitelist});
    }

    updateWhitelistItems(data, whitelist) {
        for(const facet of data) {
            const [whitelistItem] = whitelist.filter((item) => {
                return facet.id === item.id;
            });
            if(whitelistItem) {
                if(whitelistItem.data.length > 0) {
                    whitelistItem.data = this.updateWhitelistItems(facet.data, whitelistItem.data);
                }
            } else {
                whitelist.push(facet);
            }
        }
        return whitelist;
    }

    getFacetesFromImagesData(images) {
        const facets = [];
        for(const image of images) {
            for(const f of image.facets) {
                facets.push(f.id);
            }
        }
        return facets.filter(this.onlyUnique);
    }

    getData(facets) {
        let props = this.parseFacetesData(facets);
        const roots = [];
        const map = {};

        props = props.map((prop, i, props) => {
            map[prop.id] = i;
            prop.data = [];
            return prop;
        });

        const propsLen = props.length;
        for (let i = 0; i < propsLen; i++) {
            const node = props[i];
            if(node.parent !== "") {
                props[map[node.parent]].data.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    parseFacetesData(facets) {
        const props = [];
        facets.forEach(function(facet) {
            if(facet !== '_id' && facet !== 'name') {
                const idArray = facet.split('|');
                const idLen = idArray.length;
                for(let i = 0; i < idLen; i++) {
                    const newFacet = {id: '', parent: ''};
                    for(let j = 0; j <= i; j++) {
                        if(j === 0) {
                            newFacet.id += idArray[j];
                        } else {
                            newFacet.parent = newFacet.id;
                            newFacet.id += `|${idArray[j]}`;
                        }
                    }
                    if(!props.find(
                        (prop) => {
                        if(prop.id == newFacet.id) {
                            return true;
                        } else {
                            return false;
                        }
                    })) {
                        newFacet.checked = false;
                        newFacet.value = idArray[i];
                        if(i != 0) {
                            newFacet.parentValue = idArray[i-1];
                        } else{
                            newFacet.parentValue = "";
                        }
                        props.push(newFacet);
                    }
                }
            }
        });
        return props;
    }
}

module.exports = new Whitelist();
