import Ajv from "ajv/dist/2019";

import projectMetadata from "../../models/projectMetadata";
import defaultSchema from "../../models/validationSchemas/defaultNpSchema.json";

const validationSchemas = projectMetadata.getValidationSchemas();

const findErrors = (errors) => {
	const missedKeys = [];
	const incorrectKeys = [];
	errors.forEach((error) => {
		switch (error.keyword) {
			case "required":
				missedKeys.push(`${error.instancePath}/${error.params.missingProperty}`);
				break;
			case "pattern":
				incorrectKeys.push(error.instancePath);
				break;
			default:
				incorrectKeys.push(error.instancePath);
				break;
		}
	});
	return {missedKeys, incorrectKeys};
};

const validate = (data) => {
	const schemas = [];
	schemas.push(defaultSchema);
	if (Array.isArray(validationSchemas)) {
		schemas.push(...validationSchemas);
	}
	const missedKeys = [];
	const incorrectKeys = [];
	let isDataValid = true;
	schemas.forEach((schema) => {
		const ajv = new Ajv({strict: "log", allErrors: true});
		const validator = ajv.compile(schema);
		const valid = validator(data);
		if (!valid) {
			isDataValid = false;
			const errors = findErrors(validator.errors);
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
	});
	return {isDataValid, missedKeys, incorrectKeys};
};

export default validate;
