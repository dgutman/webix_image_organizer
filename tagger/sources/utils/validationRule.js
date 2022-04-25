import constants from "../constants";

// check if include more than "maxLength" consecutive characters (for ex. qwerty, 123456)
function hasConsecutiveCharacters(str, maxLength) {
	const referenceString = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
	let length = 1;
	for (let i = 0; i < str.length - 1; i++) {
		let currentChar = str.charAt(i).toUpperCase();
		let nextChar = str.charAt(i + 1).toUpperCase();
		let currentCharPosInReferenceStr = referenceString.indexOf(currentChar);
		let nextCharPosInReferenceStr = referenceString.indexOf(nextChar);
		if (
			currentCharPosInReferenceStr !== -1 &&
			currentCharPosInReferenceStr + 1 === nextCharPosInReferenceStr
		) {
			length++;
		}
		else {
			length = 0;
		}
		if (length === maxLength) {
			return true;
		}
	}
	return false;
}

function isAllCharsTheSame(str) {
	if (str) {
		for (let i = 1; i < str.length; i++) {
			if (str.charAt(i - 1) !== str.charAt(i)) {
				return false;
			}
		}
	}
	return true;
}

function validatePassword(value, firstName, lastName, email, login) {
	const pattern = new RegExp(constants.PATTERN_PASSWORD);
	const patternHasSpecSymbols = new RegExp(constants.PATTERN_PASSWORD_HAS_SPEC_SYMBOLS);
	login = login.trim().toUpperCase();
	email = email.trim().toUpperCase();
	firstName = firstName.trim().toUpperCase();
	lastName = lastName.trim().toUpperCase();
	return webix.rules.isNotEmpty(value) &&
		pattern.test(value) &&
		patternHasSpecSymbols.test(value) &&
		!isAllCharsTheSame(value) &&
		!hasConsecutiveCharacters(value, 4) &&
		// if login is empty then  we do not need to react on existing login in value
		(!login || value.toUpperCase().indexOf(login) === -1) &&
		(!email || value.toUpperCase().indexOf(email) === -1) &&
		(!firstName || value.toUpperCase().indexOf(firstName) === -1) &&
		(!lastName || value.toUpperCase().indexOf(lastName) === -1);
}

function validateLogin(value) {
	const pattern = new RegExp(constants.PATTERN_LOGIN);
	return webix.rules.isNotEmpty(value) &&
		pattern.test(value);
}

export default {
	validatePassword,
	hasConsecutiveCharacters,
	isAllCharsTheSame,
	validateLogin
};
