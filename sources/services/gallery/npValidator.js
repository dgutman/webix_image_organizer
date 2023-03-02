import Ajv from "ajv/dist/2019";

import projectMetadata from "../../models/projectMetadata";
import itemSchema from "../../models/validationSchemas/defaultNpSchema.json";

const validationSchemas = projectMetadata.getValidationSchemas();

const findErrors = (errors) => {
	const missedKeys = [];
	const incorrectKeys = [];
	errors.forEach((error) => {
		if (error.keyword === "required") {
			missedKeys.push(`${error.instancePath}/${error.params.missingProperty}`);
		}
		if (error.params?.allowedValues) {
			incorrectKeys.push(error.instancePath);
		}
	});
	return {missedKeys, incorrectKeys};
};

const validate = (data) => {
	const schemas = [];
	schemas.push(itemSchema);
	schemas.push(...validationSchemas);
	const missedKeys = [];
	const incorrectKeys = [];
	let isDataValid = true;
	schemas.forEach((schema) => {
		const ajv = new Ajv({strict: "log"});
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
