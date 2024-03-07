const keys = [];
for (let i = 0; i < 10; i++) {
	keys.push(i.toString());
}
for (let i = 0; i < 26; i++) {
	keys.push(String.fromCharCode(97 + i).toString());
}

const collection = new webix.DataCollection({
	data: keys
});

export default collection;
