const settings = ["Show all channels"];

for (let i = 1; i < 36; i++) {
	settings.push(`Show channel ${i}`);
}

const collection = new webix.DataCollection({
	data: settings
});

export default collection;
