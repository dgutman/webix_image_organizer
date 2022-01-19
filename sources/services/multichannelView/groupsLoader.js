import utils from "../../utils/utils";
import groupsValidator from "./channelGroupsValidator";
import ajaxActions from "../ajaxActions";

const GROUPS_METADATA_FIELD = "DSAGroupSet";

function prepareGroupsToExport(groups) {
	return groups.map((group) => {
		const channels = group.channels.map(channel => ({
			name: channel.name,
			index: channel.index,
			color: channel.color,
			min: channel.min,
			max: channel.max,
			opacity: channel.opacity
		}));
		return {
			name: group.name,
			channels
		};
	});
}

function parseJSONFile(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		if (!file.type === "application/json") {
			const errorMessage = "Incorrect file type";
			reject(errorMessage);
			return;
		}
		fileReader.readAsText(file);

		fileReader.addEventListener("load", () => {
			resolve(JSON.parse(fileReader.result));
		});

		fileReader.addEventListener("error", () => {
			reject();
		});
	});
}

function validateGroupsData(data) {
	return new Promise((resolve, reject) => {
		const validationResult = groupsValidator(data);
		if (!validationResult) {
			reject(groupsValidator.errors);
			return;
		}

		resolve(data);
	});
}

export function downloadGroup(imageName, imageId, groups) {
	const fileData = {
		groups: prepareGroupsToExport(groups),
		imageId,
		name: imageName
	};
	const json = JSON.stringify(fileData);
	const fileToSave = new Blob([json], {
		type: "application/json"
	});

	const [name] = imageName.split(".");
	utils.downloadBlob(fileToSave, `${name}-channel-groups.json`);
}

export async function getImportedGroups(file) {
	try {
		const fileData = await parseJSONFile(file);
		await validateGroupsData(fileData);
		return fileData;
	}
	catch (err) {
		return err;
	}
}

export async function getSavedGroups(image) {
	const dataToValidate = {
		imageId: image._id,
		name: image.name,
		groups: image.meta && image.meta[GROUPS_METADATA_FIELD]
	};
	return validateGroupsData(dataToValidate)
		.then(({groups}) => groups || [])
		.catch(() => []);
}

export async function saveGroups(imageId, groups) {
	groups = groups.map(({name, channels}) => ({name, channels}));
	const metadata = {
		[GROUPS_METADATA_FIELD]: groups
	};

	return ajaxActions.updateItemMetadata(imageId, metadata);
}
