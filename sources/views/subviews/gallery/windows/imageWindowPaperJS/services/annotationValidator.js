import Ajv from "ajv/dist/2019";

const findErrors = (errors) => {
	const missedKeys = [];
	const incorrectKeys = [];
	errors.forEach((error) => {
		switch (error.keyword) {
			case "required":
				missedKeys.push(`${error.instancePath}/${error.params.missingProperty}`);
				break;
			default:
				incorrectKeys.push(error.instancePath);
				break;
		}
	});
	return {missedKeys, incorrectKeys};
};

const validate = (data, schema) => {
	const missedKeys = [];
	const incorrectKeys = [];
	let fixedData = null;
	const ajv = new Ajv({strict: "log", allErrors: true});
	const validateSchema = ajv.compile(schema);
	const valid = validateSchema(data);
	if (!valid) {
		const errors = findErrors(validateSchema.errors, data);
		if (errors.incorrectKeys.length > 0) {
			const fixedResult = validateAndFix(data, schema);
			const errorsAfterFix = findErrors(fixedResult.errors, fixedResult.data);
			missedKeys.push(...errorsAfterFix.missedKeys.map(
				missedKey => ({
					schemaId: schema.$id,
					missedKey
				})
			));
			incorrectKeys.push(...errorsAfterFix.incorrectKeys.map(
				incorrectKey => ({
					schemaId: schema.$id,
					incorrectKey
				})
			));
			fixedData = fixedResult.data;
		}
		else {
			missedKeys.push(...errors.missedKeys.map(
				missedKey => ({
					schemaId: schema.$id,
					missedKey
				})
			));
			incorrectKeys.push(...errors.incorrectKeys.map(
				incorrectKey => ({
					schemaId: schema.$id,
					incorrectKey
				})
			));
		}
	}
	return fixedData;
};

function validateAndFix(data, schema) {
	// Clone original data to avoid mutation
	const fixedData = JSON.parse(JSON.stringify(data));
	const result = {
		valid: true,
		data: fixedData,
		errors: [],
	};

	const ajv = new Ajv({strict: "log", allErrors: true});
	const validateSchema = ajv.compile(schema);
	validateSchema(fixedData);

	// Check for errors (like wrong types, enums, etc.)
	if (validateSchema.errors) {
		for (const error of validateSchema.errors) {
			const keyPath = error.instancePath.replace(/^\//, "").split("/");
			const property = keyPath.pop();
			const parent = keyPath.reduce((obj, key) => obj?.[key], fixedData);

			// Try to fetch default from schema
			const schemaSub = getSchemaSubsection(schema, keyPath.concat(property));
			if (schemaSub?.default !== undefined && parent && property) {
				parent[property] = schemaSub.default;
			}
		}

		// Re-validate after corrections
		validateSchema(fixedData);
		result.valid = result.valid || validateSchema.errors === null;
		result.errors.push(...(validateSchema.errors ?? []));
	}
	return result;
}

// Helper to walk schema and get subschema
function getSchemaSubsection(schema, pathArray) {
	let current = schema;
	for (const key of pathArray) {
		if (current.type === "object" && current.properties?.[key]) {
			current = current.properties[key];
		}
		else {
			return null;
		}
	}
	return current;
}

export default {
	validate
};
