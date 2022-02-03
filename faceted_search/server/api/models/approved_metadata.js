const mongoose = require('mongoose');
const facetImages = require('../models/facet_images');
const constants = require('../../constants');

const approvedMetadataSchema = new mongoose.Schema({
	data: {
		type: Object,
		required: true
	}
},
{timestamps: true});

const approvedMetadataModel = mongoose.model('approvedMetadata', approvedMetadataSchema);

class Approved_metadata {
	async getApprovedMetadataData() {
		try{
			const result = await approvedMetadataModel.findOne({}). exec();
			if(result && result.data) {
				return result.data;
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
		}
	}

	async getApprovedMetadata() {
		return await approvedMetadataModel.findOne({}).exec();
	}

	async updateApprovedMetadata(valuesForUpdate) {
		try {
			const data = await this.getApprovedMetadataData();
			if(data) {
				const resultOfDeleteOne = await approvedMetadataModel.deleteOne({}).exec();
				if(resultOfDeleteOne.ok === 1) {
					const newData = this.checkItems(data, valuesForUpdate);
					await this.insert(newData);
					return await this.getApprovedMetadataData();
				}
			}
		} catch(e) {
			console.error(e);
		}
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
		const doc = new approvedMetadataModel({
			data: newData
		});
		await doc.save();
	}

	async initialApprovedMetadata() {
		try{
			const images = await facetImages.getAll();
			let facets;
			if(images.length !== 0) {
				facets = this.getFacetesFromImagesData(images);
			}
			let data;
			if(facets) {
				data = this.getData(facets);
			}
			if(data) {
				await this.insert(data);
			}
		} catch(e) {
			console.error(e);
		}
	}

	async insertItems(image) {
		const facets = this.getFacetesFromImagesData([image]);
		const data = this.getData(facets);
		const approvedMetadata = await this.getApprovedMetadata();
		if(approvedMetadata) {
			const newApprovedMetadataData = this.updateApprovedMetadataItems(data, approvedMetadata.data);
			const approvedMetadataId = approvedMetadata._id.toString();
			await approvedMetadataModel.updateOne({_id: approvedMetadataId}, {data: newApprovedMetadataData});
		} else {
			await this.insert(data);
		}
	}

	updateApprovedMetadataItems(data, approvedMetadata) {
		for(const facet of data) {
			const [approvedMetadataItem] = approvedMetadata.filter((item) => {
				return facet.id === item.id;
			});
			if(approvedMetadataItem) {
				if(approvedMetadataItem.data.length > 0) {
					approvedMetadataItem.data = this.updateApprovedMetadataItems(facet.data, approvedMetadataItem.data);
				}
			} else {
				approvedMetadata.push(facet);
			}
		}
		return approvedMetadata;
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
		facets.forEach((facet) => {
			const idArray = facet.split('|');
			const idArrayLen = idArray.length;
			for(let i = 0; i < idArrayLen; i++) {
				const newFacet = {id: '', parent: ''};
				for(let j = 0; j <= i; j++) {
					if(j === 0) {
						newFacet.id += idArray[j];
					} else {
						newFacet.parent = newFacet.id;
						newFacet.id += `|${idArray[j]}`;
					}
				}
				if(!this.checkForServiceMetadata(newFacet)) {
					if(!props.find(
						(prop) => prop.id === newFacet.id
					)) {
						newFacet.checked = false;
						newFacet.value = idArray[i];
						if(i !== 0) {
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
	checkForServiceMetadata(newFacet) {
		let flag = false;
		constants.HIDDEN_METADATA_FIELDS.forEach((serviceMetadata, i) => {
			if(newFacet.id.includes(serviceMetadata)) {
				flag = true;
			}
		});
		return flag;
	}

	async deleteAllDocuments() {
		const result = await approvedMetadataModel.deleteMany({});
		return result.ok;
	}
}

module.exports = new Approved_metadata();
