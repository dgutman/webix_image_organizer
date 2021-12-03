import Ajv from "ajv";

// TODO: add annotation schema
const annotationSchema = {};

const validate = (data) => {
	const ajv = new Ajv({strict: "log"});
	const validator = ajv.compile(annotationSchema);
	const valid = validator(data);
	return valid;
};

export default validate;
