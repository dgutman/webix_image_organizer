import papaparse from "papaparse";
import constants from "../../constants";


export default class UploaderService {
	constructor(uploader, filesDropDown, uploadMetadataView, view) {
		this.uploader = uploader;
		this.filesDropDown = filesDropDown;
		this.uploadMetadataView = uploadMetadataView;
		this.view = view;

		this.initUploaderEvents();
	}

	initUploaderEvents() {
		this.uploader.addDropZone(this.uploadMetadataView.$view, "Drop files here");
		const fileList = this.filesDropDown.getList();
		this.uploader.attachEvent("onBeforeFileAdd", (file) => { // onBeforeFileDrop
			this.view.showProgress();
			this.parseFile(file)
				.then((data) => {
					fileList.parse([data]);
					this.filesDropDown.setValue(fileList.getLastId());
					this.view.hideProgress();
				})
				.catch((message) => {
					webix.message(message);
					this.view.hideProgress();
				});
		});

		// to prevent the dropping of any item except the file
		this.uploader.attachEvent("onBeforeFileDrop", files => !!files.length);

		fileList.attachEvent("onAfterLoad", () => {
			this.filesDropDown.enable();
		});
	}

	parseFile(file) {
		return new Promise((resolve) => {
			let message = `Not allowed filetype: ${file.type}`;

			if (constants.ALLOWED_FILE_EXTENSIONS.includes(file.type)) {
				const fileList = this.filesDropDown.getList();
				if (fileList.find(item => item.name === file.name, true)) {
					message = `File with name "${file.name}" already exists`;
					throw message;
				}

				const fr = new FileReader();
				fr.addEventListener("load", () => {
					const text = fr.result;
					const json = papaparse.parse(text, {header: true});
					json.name = file.name;
					resolve(json);
				}, false);

				fr.addEventListener("error", (err) => {
					throw err;
				}, false);

				fr.readAsText(file.file);
			}
			else {
				throw message;
			}
		});
	}
}
