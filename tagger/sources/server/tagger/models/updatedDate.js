class UpdatedDate {
	setDate(date) {
		this.date = date || Date.now();
	}

	getDate() {
		return this.date || Date.now();
	}
}

const instanse = new UpdatedDate();

module.exports = instanse;
