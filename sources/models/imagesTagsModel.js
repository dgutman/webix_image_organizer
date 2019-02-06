const imagesTagsCollection = new webix.DataCollection();

const MARKER_TAGS = [
	{tagIcon: "tag"},
	{value: "With marker", id: "1"},
	{value: "Without marker", id: "0"},
];

const STICKER_COLORS = [
	{tagIcon: "tint"},
	{value: "Blue", id: "1"},
	{value: "Orange", id: "2"},
	{value: "Red", id: "3"},
	{value: "Violet", id: "4"},
	{value: "Azure", id: "5"},
	{value: "Green", id: "6"},
	{value: "Gray", id: "7"},
	{value: "Yellow", id: "8"}
];

const INK_TAGS = [
	{tagIcon: "eyedropper"},
	{value: "With ink", id: "1"},
	{value: "Without ink", id: "0"}
];

// add options after back-end fix
(function addTagsToCollection(options = {MARKER_TAGS, STICKER_COLORS, INK_TAGS}) {
	imagesTagsCollection.add(options);
})();

function getImagesTagsCollection() {
	return imagesTagsCollection;
}

export default {
	getImagesTagsCollection
};

