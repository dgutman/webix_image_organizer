define(
	[],
	function() {
		"use strict";
		const numberKeys = [];
		const letterKeys = [];
		for (let i = 0; i < 10; i++) {
			numberKeys.push(i.toString());
		}
		for (let i = 0; i < 26; i++) {
			letterKeys.push(String.fromCharCode(97 + i).toString());
		}

		function getLetterKeys() {
			return letterKeys;
		}

		function getNumberKeys() {
			return numberKeys;
		}

		return {
			getLetterKeys,
			getNumberKeys,
		};
	}
);
