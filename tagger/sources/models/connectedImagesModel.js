export default class ConnectedImagesModel {
	constructor() {
		this.imageIdsForAdding = [];
		this.imageIdsForRemoving = [];
		this.initialMarkedIds = [];
	}

	putInitialIdsFromItems(items) {
		const markedIds = items
			.filter(item => item._marker && !this.initialMarkedIds.includes(item._id))
			.map(item => item._id);
		this.initialMarkedIds.push(...markedIds);
	}

	addImageIdForAdding(id) {
		this.removeImageIdForRemoving(id);
		if (!this.initialMarkedIds.includes(id)) {
			this.imageIdsForAdding.push(id);
		}
	}

	addImageIdForRemoving(id) {
		this.removeImageIdForAdding(id);
		if (this.initialMarkedIds.includes(id)) {
			this.imageIdsForRemoving.push(id);
		}
	}

	removeImageIdForRemoving(id) {
		this.imageIdsForRemoving = this.imageIdsForRemoving.filter(item => item !== id);
	}

	removeImageIdForAdding(id) {
		this.imageIdsForAdding = this.imageIdsForAdding.filter(item => item !== id);
	}

	getImagesIdsForAdding() {
		return this.imageIdsForAdding;
	}

	getImagesIdsForRemoving() {
		return this.imageIdsForRemoving;
	}

	countUnsavedItems() {
		return this.imageIdsForAdding.concat(this.imageIdsForRemoving).length;
	}

	clearIdArrayForAdding() {
		this.imageIdsForAdding = [];
	}

	clearIdArrayForRemoving() {
		this.imageIdsForRemoving = [];
	}

	clearInitialMarkedIds() {
		this.initialMarkedIds = [];
	}

	clearModel() {
		this.imageIdsForAdding = [];
		this.imageIdsForRemoving = [];
		this.initialMarkedIds = [];
	}
}
