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
			default:
				incorrectKeys.push(error.instancePath);
				break;
		}
	});
	return {missedKeys, incorrectKeys};
};

const validate = (data) => {
	const schemas = [];
	const validationFolder = projectMetadata.getValidationFolder();
	const foldersAndSchemasMapping = projectMetadata.getFolderAndSchemasMapping();
	const validationSchemasIds = foldersAndSchemasMapping?.get(validationFolder?.name);
	if (Array.isArray(validationSchemasIds) && validationSchemasIds?.length) {
		schemas.push(...validationSchemas.filter(schema => validationSchemasIds.includes(schema.$id)));
	}
	else {
		schemas.push(defaultSchema);
	}
	const missedKeys = [];
	const incorrectKeys = [];
	let isDataValid = true;
	schemas.forEach((schema) => {
		const ajv = new Ajv({strict: "log", allErrors: true});
		const validateSchema = ajv.compile(schema);
		const valid = validateSchema(data);
		if (!valid) {
			isDataValid = false;
			const errors = findErrors(validateSchema.errors, data);
			console.log(errors);
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
