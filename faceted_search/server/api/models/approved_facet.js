const mongoose = require('mongoose');
const facetImages = require('../models/facet_images');
const lodash = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const approvedFacetSchema = new mongoose.Schema({
	facetId: String,
	hidden: Boolean,
	parentId: String
});

const separator = '|';

const approvedFacetModel = mongoose.model('approvedFacet', approvedFacetSchema);

class ApprovedFacet {
	async getApprovedFacetData() {
		try {
			const result = await approvedFacetModel.find({}).exec();
			if(result) {
				const approvedFacets = result.map((approvedFacetItem) => {
					return {
						_id: approvedFacetItem._id.toString(),
						facetId: approvedFacetItem.facetId,
						hidden: approvedFacetItem.hidden,
						parentId: approvedFacetItem.parentId
					};
				});
				return approvedFacets;
			} else {
				return [];
			}
		} catch(e) {
			console.error(e);
			return ('Internal error');
		}
	}

	async addApprovedFacetData() {
		try {
			const images = await facetImages.getAll();
			const facetIds = [];
			if(images && images.length !== 0) {
				lodash.forEach(images, (image) => {
					lodash.forEach(image.facets, (facet) => {
						const index = lodash.indexOf(facetIds, facet.id);
						if(index < 0) {
							facetIds.push(facet.id);
						}
					});
				});
			}
			const approvedFacets = await approvedFacetModel.find({}).exec();
			if(approvedFacets) {
				approvedFacets.forEach((approvedFacetItem) => {
					lodash.remove(facetIds, (facetId) => {
						return facetId === approvedFacetItem;
					});
				});
				lodash.forEach(facetIds, (facetId) => {
					this._pushInApprovedFacets(facetIds, facetId, approvedFacets);
				});
				approvedFacets.forEach((approvedFacetItem) => {
					const doc = new approvedFacetModel({
						facetId: approvedFacetItem.facetId,
						hidden: approvedFacetItem.hidden,
						parentId: approvedFacetItem.parentId
					});
					doc.save();
				});
			}
		} catch(e) {
			console.error(e);
		}
	}

	_pushInApprovedFacets(facetIds, facetId, approvedFacet) {
		let parentId = '';
		const lastIndexOfSeparator = facetId.lastIndexOf(separator);
		if(lastIndexOfSeparator > -1) {
			parentId = facetId.slice(0, lastIndexOfSeparator);
		}
		const indexOfParentId = lodash.indexOf(facetIds, parentId);
		if(indexOfParentId === -1 && parentId !== '') {
			this._pushInApprovedFacets(facetIds, parentId, approvedFacet);
		}
		const countOfApprovedFacets = lodash.filter(approvedFacet, {'facetId': facetId});
		if(countOfApprovedFacets.length === 0) {
			approvedFacet.push( {
				facetId: facetId,
				parentId: parentId,
				hidden: true
			});
		}
	}

	updateApprovedFacetData(valuesForUpdate) {
		let result = true;
		valuesForUpdate.forEach(async (newValue) => {
			try {
				await approvedFacetModel.updateOne(
					{"_id": ObjectID(newValue._id)},
					{
						$set: {"hidden": newValue.hidden}
					}
				);
			} catch(e) {
				result = false;
				console.error(e);
			}
		});
		return result;
	}
}

module.exports = new ApprovedFacet();
