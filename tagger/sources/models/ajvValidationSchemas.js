import Ajv from "ajv";
import userArraySchema from "../validationSchemas/userArray.json";
import taskSchema from "../validationSchemas/task.json";

const ajv = new Ajv({allErrors: true});

ajv.addFormat("custom-date-time", {
	validate: (dateTimeString) => {
		if (dateTimeString == +dateTimeString) {
			dateTimeString = +dateTimeString;
		}
		const date = new Date(dateTimeString);
		const timestamp = Date.parse(date);
		return timestamp && typeof timestamp === "number";
	}
});

ajv.addSchema(userArraySchema, "users");
ajv.addSchema(taskSchema, "task");

export default ajv;
