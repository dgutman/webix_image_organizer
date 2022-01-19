const imagesTagsCollection = new webix.DataCollection();

const marker = [
	"true",
	"false"
];

const stickers = [
	"blue",
	"orange",
	"red",
	"violet",
	"azure",
	"green",
	"gray",
	"yellow"
];

// const INK_TAGS = [
// 	{tagIcon: "eyedropper"},
// 	{value: "With ink", id: "1"},
// 	{value: "Without ink", id: "0"}
// ];

// add options after back-end fix
(function addTagsToCollection(options = {marker, stickers}) {
	imagesTagsCollection.add(options);
}());

function getImagesTagsCollection() {
	return imagesTagsCollection;
}

export default {
	getImagesTagsCollection
};

