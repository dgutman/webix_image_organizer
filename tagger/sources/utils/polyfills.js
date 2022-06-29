/*eslint-disable*/
if (!String.prototype.splice) {
	/**
	 * {JSDoc}
	 *
	 * The splice() method changes the content of a string by removing a range of
	 * characters and/or adding new characters.
	 *
	 * @this {String}
	 * @param {number} start Index at which to start changing the string.
	 * @param {number} delCount An integer indicating the number of old chars to remove.
	 * @param {string} newSubStr The String that is spliced in.
	 * @return {string} A new string with the spliced substring.
	 */
	String.prototype.splice = function (start, delCount, newSubStr) {
		return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
	};
}

// add number of days to date
Date.prototype.addDays = function (days) {
	this.setDate(this.getDate() + parseInt(days));
	return this;
};

Array.prototype.sum = function (prop) {
	let total = 0;
	for (let i = 0, _len = this.length; i < _len; i++) {
		total += this[i][prop];
	}

	return total;
};

Array.prototype.unique = function () {
	let a = this.concat();
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) { a.splice(j--, 1); }
		}
	}

	return a;
};
