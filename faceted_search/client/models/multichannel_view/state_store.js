define([
	"constants"
], function(constants) {
	'use strict';
	return {
		template: null,
		group: null,
		image: null,
		adjustedChannel: null,
		loadedImages: {},
		bit: constants.SIXTEEN_BIT,
		imageMetadata: null
	};
});
