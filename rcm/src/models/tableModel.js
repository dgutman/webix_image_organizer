const yamlData = [];

function getItemYamlID(item) {
	return item.yamlId;
}

function getYamlData() {
	return yamlData;
}

function setYamlData(dataArray) {
	yamlData.length = 0;
	yamlData.push(...dataArray)
}

const tableModel = {
	getItemYamlID,
	getYamlData,
	setYamlData,
}

export default tableModel;
