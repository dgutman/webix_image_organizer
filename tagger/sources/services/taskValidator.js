import Ajv from "ajv";
import taskSchema from "../validationSchemas/task.json";
import userArraySchema from "../validationSchemas/userArray.json";

const ajv = new Ajv({allErrors: true});
ajv.addFormat("custom-date-time", {
	validate: (dateTimeString) => {
		dateTimeString = parseInt(dateTimeString) || dateTimeString;
		const date = new Date(dateTimeString);
		const timestamp = Date.parse(date);
		return timestamp && typeof timestamp === "number";
	}
});

ajv.addSchema(userArraySchema, "users");
const schema = taskSchema;
const validator = ajv.compile(schema);

export default validator;
