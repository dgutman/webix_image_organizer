import Ajv from "ajv/dist/2019";
import lodash from "lodash";

import projectMetadata from "../../models/projectMetadata";
import defaultSchema from "../../models/validationSchemas/defaultNpSchema.json";
import utils from "../../utils/utils";


const validationSchemas = projectMetadata.getValidationSchemas();

/**
 *
 * @param {ErrorObject[]} errors Array of errors
 * @param {*} item Item where errors must be fixed
 * @returns {{object}|null} Object with fixed meta
 */
function fixErrors(errors, item) {
	const itemCopy = webix.copy(item);
	const fixedObject = {meta: {}};
	let path;
	let value;
	errors.forEach((error) => {
		switch (error.keyword) {
			case "required":
				if (error.params.missingProperty) {
					path = `${error.instancePath}/${error.params.missingProperty}`.slice(1).replaceAll("/", ".");
					value = "";
					itemCopy.meta = utils.setPropertyAndGetNewObject(itemCopy.meta, path, value);
					Object.assign(fixedObject.meta, itemCopy.meta);
				}
				break;
			case "pattern":
				break;
			case "type":
				switch (error.params.type) {
					case "object":
						value = {};
						break;
					case "string":
						value = "";
						break;
					case "array":
						value = [];
						break;
					case "boolean":
						value = false;
						break;
					case "number":
						value = 0;
						break;
					case "null":
						value = null;
						break;
					default:
						value = "";
						break;
				}
				path = error.instancePath.slice(1).replaceAll("/", ".");
				itemCopy.meta = utils.setPropertyAndGetNewObject(itemCopy.meta, path, value);
				if (typeof value === "object") {
					// eslint-disable-next-line no-use-before-define
					fixedObject.meta = findAndFixErrors(itemCopy)?.meta;
				}
				else {
					fixedObject.meta = itemCopy.meta;
				}
				break;
			default:
				break;
		}
	});
	if (!lodash.isEmpty(fixedObject.meta)) {
		return fixedObject;
	}
	return null;
}

/**
 *
 * @param {{object}|null} item Item to udpate
 * @returns {{object}|null} Object with updated meta
 */
function findAndFixErrors(item) {
	const itemCopy = webix.copy(item);
	const fixedItem = {meta: {}};
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
	schemas.forEach((schema) => {
		const ajv = new Ajv({strict: "log", allErrors: true});
		const validateSchema = ajv.compile(schema);
		const valid = validateSchema(itemCopy.meta);
		if (!valid) {
			const temp = fixErrors(validateSchema.errors, itemCopy);
			Object.assign(fixedItem.meta, temp?.meta || {});
		}
	});
	// ajaxActions.updateItemMetadata(item._id, data);
	if (!lodash.isEmpty(fixedItem.meta)) {
		Object.assign(itemCopy.meta, fixedItem.meta);
		return itemCopy;
	}
	return null;
}

export default findAndFixErrors;
