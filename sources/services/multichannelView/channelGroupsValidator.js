import Ajv from "ajv";
import groupsSchema from "../../models/validationSchemas/channelGroups.json";

const ajv = new Ajv({allErrors: true});

const schema = groupsSchema;
const validator = ajv.compile(schema);

export default validator;
