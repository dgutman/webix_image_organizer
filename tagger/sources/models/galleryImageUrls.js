// for storing tempraraly blob urls for gallery images
let previewUrls = {};
let normalUrls = {};
let previewLabelUrls = {};
let previewMacroUrls = {};

function setPreviewImageUrl(imageId, url) {
	previewUrls[imageId] = url;
}

function getPreviewImageUrl(imageId) {
	return previewUrls[imageId];
}

function setNormalImageUrl(imageId, url) {
	normalUrls[imageId] = url;
}

function getNormalImageUrl(imageId) {
	return normalUrls[imageId];
}

function clearPreviewUrls() {
	previewUrls = {};
}

function getLabelPreviewImageUrl(imageId) {
	return previewLabelUrls[imageId];
}

function setPreviewLabelImageUrl(imageId, url) {
	previewLabelUrls[imageId] = url;
}

function clearPreviewLabelUrls() {
	previewLabelUrls = {};
}

function getPreviewMacroImageUrl(imageId) {
	return previewMacroUrls[imageId];
}

function setPreviewMacroImageUrl(imageId, url) {
	previewMacroUrls[imageId] = url;
}

function clearPreviewMacroImageUrl() {
	previewMacroUrls = {};
}

export default {
	setPreviewImageUrl,
	getPreviewImageUrl,
	setNormalImageUrl,
	getNormalImageUrl,
	clearPreviewUrls,
	getLabelPreviewImageUrl,
	setPreviewLabelImageUrl,
	clearPreviewLabelUrls,
	getPreviewMacroImageUrl,
	setPreviewMacroImageUrl,
	clearPreviewMacroImageUrl
};
