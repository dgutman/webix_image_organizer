define([
	"app",
	"models/images",
	"templates/image",
	"views/filter_header",
	"views/image_window",
	"views/multichannel_view",
	"views/detailed_image_view"
], function(
	app,
	Images,
	imageTemplate,
	filterHeaderView,
	ImageWindow,
	multichannelView,
	detailedImageView
) {
	const dataviewId = "images-dataview";

	const ui = {
		id: "dataview-layout",
		rows: [
			filterHeaderView,
			{
				id: dataviewId,
				view: "dataview",
				css: "images-dataview",
				scroll: true,
				select: true,
				data: null,
				on: {
					onItemClick: async function(id) {
						const item = this.getItem(id);
						const imageWindow = new ImageWindow(app);
						app.ui(imageWindow);
						imageWindow.showWindow(item);
					}
				},
				onClick: {
					multichannel: (ev, id) => {
						const item = $$(dataviewId).getItem(id);
						multichannelView.validateImage(item.data)
							.then((isValid) => {
								const view = isValid ? multichannelView : detailedImageView;
								view.show(item.data._id);
							});
						return false;
					}
				},
				template: function(data) {
					return imageTemplate.getTemplate(data);
				},
				tooltip: (data) => {
					return data.data && data.data.name ? data.data.name : "";
				}
			}
		]
	};

	Images.attachEvent("imagesLoaded", function() {
		const data = this.getImages();
		$$(dataviewId).clearAll();
		$$(dataviewId).parse(data);
		$$(dataviewId).hideProgress();
	});

	Images.attachEvent("imagesViewStateChange", function() {
		const sizes = this.getImagesSize($$(dataviewId).$width);
		$$(dataviewId).define("type", sizes);
		$$(dataviewId).render();
	});


	return {
		$ui: ui,
		$oninit() {
			webix.extend($$(dataviewId), webix.ProgressBar);
			webix.extend($$(dataviewId), webix.OverlayBox);
			const sizes = Images.getImagesSize($$(dataviewId).$width);
			$$(dataviewId).define("type", sizes);
				$$(dataviewId).showProgress({
					type: "icon"
				});
				Images.loadImages();
		}
	};
});
