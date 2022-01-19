const noValue = "&lt;no value&gt;";

function getMongoQueryByValueFilters(filters) {
	const tagNames = Object.keys(filters);
	const query = {};
	if (tagNames.length) {
		query.$and = [];
		tagNames.forEach((name) => {
			let tagObj = {};
			if (filters[name].length) {
				const noValueIndex = filters[name].findIndex(item => item.value === noValue);
				if (noValueIndex !== -1) {
					filters[name].splice(noValueIndex, 1);
					tagObj = {$or: [
						{
							[`meta.tags.${name}`]: {$exists: true, $eq: []}
						},
						{
							[`meta.tags.${name}.value`]: {
								$in: filters[name].map(valObj => valObj.value)
							}
						}
					]};
				}
				else {
					tagObj = {
						[`meta.tags.${name}.value`]: {
							$in: filters[name].map(valObj => valObj.value)
						}
					};
				}
			}
			else {
				tagObj = {
					[`meta.tags.${name}`]: {$exists: true, $ne: []}
				};
			}
			query.$and.push(tagObj);
		});
	}
	return query;
}

module.exports = {
	getMongoQueryByValueFilters
};
