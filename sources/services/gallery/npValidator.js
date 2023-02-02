import Ajv from "ajv/dist/2019";
import itemSchema from "../../models/validationSchemas/npSchema.json";

const validate = (data) => {
	const ajv = new Ajv({strict: "log"});
	const validator = ajv.compile(itemSchema);
	const valid = validator(data);
	const missedKeys = [];
	const incorrectKeys = [];
	if (!valid) {
		const errors = findErrors(validator.errors);
		missedKeys.push(...errors.missedKeys);
		incorrectKeys.push(...errors.incorrectKeys);
	}
	return {valid, missedKeys, incorrectKeys};
};

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
}

export default validate;
