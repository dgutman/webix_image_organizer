const groupsSchema = {
    "type": "object",
    "additionalProperties": false,
    "properties": {
		"name": {
			"type": "string"
		},
		"imageId": {
			"type": "string"
		},
		"groups": {
			"type": "array",
			"items": {
				"type": "object",
				"minItems": 1,
				"uniqueItems": true,
				"properties": {
					"name": {
						"type": ["string", "number"]
					},
					"channels": {
						"type": "array",
						"minItems": 1,
						"uniqueItems": true,
						"items": {
							"type": "object",
							"properties": {
								"name": {
									"type": ["string", "number"]
								},
								"opacity": {
									"enum": [0, 1]
								},
								"min": {
									"type": "number"
								},
								"max": {
									"type": "number"
								},
								"color": {
									"type": "string"
								}
							},
							"required": [
								"name",
								"color",
								"min",
								"max"
							]
						}
					}
				},
				"required": [
					"channels",
					"name"
				]
			}
		}
    },
    "required": [
		"groups",
		"imageId"
    ]
}

define([
], function(Ajv) { // TODO: make it work
	'use strict';

	const ajv = new Ajv({allErrors: true});
	const validator = ajv.compile(groupsSchema);

	return validator;
});