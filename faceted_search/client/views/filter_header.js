define([
	"app",
	"constants",
	"models/images",
	"views/filter_breadcrumbs",
	"views/toolbar",
	"views/user_panel",
	"views/components/header_label",
	"views/video_window",
	"windows/export_csv_window"
], function(
	app,
	constants,
	Images,
	breadcrumbs,
	modeToolbar,
	userPanel,
	HeaderLabel,
	VideoWindow,
	ExportCSVWindow
) {
	// window.img = Images;
	const toolbarId = "filter_toolbar";
	const smallImageTemplateButtonId = 'small_template_button_id';
	const mediumImageTemplateButtonId = 'medium_template_button_id';
	const largeImageTemplateButtonId = 'large_template_button_id';
	const tutorialButtonId = 'tutorial_button_id';
	const exportButtonId = 'export_button_id';
	const pushToServerButtonId = 'push_to_server_id';

	const headerLabel = new HeaderLabel(app);

	const ui = {
		view: "toolbar",
		id: toolbarId,
		rows: [
			{
				id: "a1",
				rows: [
					{
						responsive: "a1",
						cols: [
							headerLabel,
							{
								view: "button",
								id: exportButtonId,
								label: "Export CSV",
								width: 100,
								click: function() {
									const images = Images.getImages().serialize();
									const dataToExport = images.map((image) => image.data);
									const exportWindow = new ExportCSVWindow(app);
									app.ui(exportWindow);
									exportWindow.showWindow(dataToExport);
								}
							},
							{
								view: "button",
								id: pushToServerButtonId,
								label: "Push to Dataset",
								width: 150,
								click: function() {
									const images = Images.getImages().serialize();
									const dataToExport = images.map((image) => image.data);
									const exportWindow = new ExportCSVWindow(app);
									app.ui(exportWindow);
									const isDatasetPush = true;
									exportWindow.showWindow(dataToExport, isDatasetPush);
								}
							},
							{
								cols: [
									{gravity: 1},
									{
										view: "label",
										id: "view_label",
										label: "View",
										align: "left",
										width: 50
									},
									{
										view: "icon",
										id: smallImageTemplateButtonId,
										icon: "mdi mdi-table-large",
										click: function() {
											Images.changeImagesViewState(constants.TEMPLATE_IMAGE_SIZE.SMALL);
											this.disable();
											$$(mediumImageTemplateButtonId).enable();
											$$(largeImageTemplateButtonId).enable();
										}
									},
									{
										view: "icon",
										id: mediumImageTemplateButtonId,
										icon: "mdi mdi-table",
										click: function() {
											Images.changeImagesViewState(constants.TEMPLATE_IMAGE_SIZE.MEDIUM);
											this.disable();
											$$(smallImageTemplateButtonId).enable();
											$$(largeImageTemplateButtonId).enable();
										}
									},
									{
										view: "icon",
										id: largeImageTemplateButtonId,
										icon: "mdi mdi-table-column",
										click: function() {
											Images.changeImagesViewState(constants.TEMPLATE_IMAGE_SIZE.LARGE);
											this.disable();
											$$(smallImageTemplateButtonId).enable();
											$$(mediumImageTemplateButtonId).enable();
										}
									},
											{width: 0}
									]},
									{
										cols: [
											{gravity: 1},
											modeToolbar,
									{
										view: "button",
										id: tutorialButtonId,
										label: "Tutorial",
										width: 100,
										click: function() {
											const videoWindow = new VideoWindow(app);
											app.ui(videoWindow);
											videoWindow.showWindow();
										}
									},
									userPanel
								]
							}
						]
					}
				]
			},
			breadcrumbs
		]
	};

	return {
		$ui: ui,
		$oninit: function() {
			const state = Images.getImagesViewState();
			switch (state) {
				case constants.TEMPLATE_IMAGE_SIZE.SMALL:
					$$(smallImageTemplateButtonId).disable();
					$$(mediumImageTemplateButtonId).enable();
					$$(largeImageTemplateButtonId).enable();
					break;
				case constants.TEMPLATE_IMAGE_SIZE.MEDIUM:
					$$(smallImageTemplateButtonId).enable();
					$$(mediumImageTemplateButtonId).disable();
					$$(largeImageTemplateButtonId).enable();
					break;
				case constants.TEMPLATE_IMAGE_SIZE.LARGE:
					$$(smallImageTemplateButtonId).enable();
					$$(mediumImageTemplateButtonId).enable();
					$$(largeImageTemplateButtonId).disable();
					break;
				default:
					$$(smallImageTemplateButtonId).disable();
					$$(mediumImageTemplateButtonId).enable();
					$$(largeImageTemplateButtonId).enable();
					break;
			}
			$$(smallImageTemplateButtonId).render();
			$$(mediumImageTemplateButtonId).render();
			$$(largeImageTemplateButtonId).render();
		}
	};
});
