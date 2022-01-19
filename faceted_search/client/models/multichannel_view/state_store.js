define([
	"constants"
], function(constants) {
	'use strict';
	return {
		group: null,
		image: null,
		adjustedChannel: null,
		loadedImages: {},
		bit: constants.SIXTEEN_BIT,
		imageMetadata: null
	};
});
