const {reject, resolve} = require('bluebird');
const mongoose = require('mongoose');
const facetImages = require('../models/facet_images');

const whitelistSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true
    }
});

const whitelistModel = mongoose.model('whitelist', whitelistSchema);

class Whitelist {
    getWhitelist() {
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
                                resolve();
                            }
                        }
                    });
            });
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
                                resolve();
                            }
                        }
                    });
            }
        );
    }

    updateWhitelist(req, res) {
        return new Promise(
            (resolve, reject) => {
                whitelistModel.deleteOne()
                    .then((result) => {
                        if(result.ok) {
                            let newData = JSON.parse(req.body.data);
                            const doc = new whitelistModel({
                                data: newData
                            });
                            return doc.save();
                        }
                    });
        });
    }

    initialWhitelist() {
        facetImages.getAll()
            .then((images) => {
                if(images.length !== 0) {
                    return this.getFacetesFromImagesData(images);
                }
            })
            .then((facets) => {
                if(facets) {
                    return this.getData(facets);
                }
            })
            .then((whitelist) => {
                if(whitelist) {
                    const doc = new whitelistModel({
                        data: whitelist
                    });
                    return doc.save();
                }
            });
    }

    getFacetesFromImagesData(images) {
        let facets = [];
        for(let image of images) {
            for(let f of image.facets) {
                facets.push(f.id);
            }
        }
        return facets.filter(this.onlyUnique);
    }

    getData(facets) {
        let props = this.parseFacetesData(facets);
        let roots = [];
        let map = {};

        props = props.map((prop, i, props) => {
            map[prop.id] = i;
            prop.data = [];
            return prop;
        });

        let propsLen = props.length;
        for (let i = 0; i < propsLen; i++) {
            let node = props[i];
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
        let props = [];
        facets.forEach(function(facet) {
            if(facet !== '_id' && facet !== 'name') {
                let idArray = facet.split('|');
                let idLen = idArray.length;
                for(let i = 0; i < idLen; i++) {
                    let newFacet = {id: '', parent: ''};
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
