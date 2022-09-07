define([
	"app",
	"models/images",
	"views/filter_breadcrumbs",
	"views/toolbar",
	"views/user_panel",
	"views/components/header_label",
	"views/video_window",
	"windows/export_csv_window"
], function(
	app,
	Images,
	breadcrumbs,
	modeToolbar,
	userPanel,
	HeaderLabel,
	VideoWindow,
	ExportCSVWindow
) {
	const toolbarId = "filter_toolbar";
	const rowViewButtonId = 'row_view_button_id';
	const colViewButtonId = 'col_view_button_id';
	const tutorialButtonId = 'tutorial_button_id';
	const exportButtonId = 'export_button_id';

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
							{gravity: 10, height: 1},
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
							{width: 10},
							{
								view: "label",
								id: "view_label",
								label: "View",
								align: "left",
								width: 50
							},
							{
								view: "icon",
								id: rowViewButtonId,
								icon: "mdi mdi-table",
								click: function() {
									Images.changeImagesViewState(false);
									this.disable();
									$$(colViewButtonId).enable();
								}
							},
							{
								view: "icon",
								id: colViewButtonId,
								icon: "mdi mdi-table-column",
								click: function() {
									Images.changeImagesViewState(true);
									this.disable();
									$$(rowViewButtonId).enable();
								}
							},
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
			},
			breadcrumbs
		]
	};

	return {
		$ui: ui,
		$oninit: function() {
			const state = Images.getImagesViewState();
			if(state) {
				$$(rowViewButtonId).enable();
				$$(colViewButtonId).disable();
			}else{
				$$(rowViewButtonId).disable();
				$$(colViewButtonId).enable();
			}
			$$(rowViewButtonId).render();
			$$(colViewButtonId).render();
		}
	};
});
