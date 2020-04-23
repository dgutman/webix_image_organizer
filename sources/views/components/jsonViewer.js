import JSONFormatter from "json-formatter-js";

webix.protoUI({
	name: "json-viewer",
	$cssName: "json-viewer",
	defaults: {
		viewerConfig: {
			open: Infinity,
			hoverPreviewEnabled: false,
			hoverPreviewArrayCount: 100,
			hoverPreviewFieldCount: 5,
			theme: "",
			animateOpen: true,
			animateClose: true,
			useToJSON: true
		},
		maxWidth: 600,
		minWidth: 400,
		width: 500
	},
	$init() {
		this.$view.innerHTML = "";
		this.$view.classList.add("json-viewer");
		this.$view.style.width = "fit-content";
		this.$view.style.minWidth = `${this.config.minWidth}px`;
		this.$view.style.maxWidth = `${this.config.maxWidth}px`;
		this.$view.style.overflow = "auto";
	},
	_set_size() {
		this.$view.style.width = "fit-content";
		const width = this.$view.offsetWidth;
		if (this.$width !== width) {
			const validWidth = Math.max(Math.min(width, this.config.maxWidth), this.config.minWidth);
			this.define("width", validWidth);
			this.$view.style.width = `${validWidth}px`;
			this.resize();
		}
		else {
			this.$view.style.width = `${this.$width}px`;
		}
	},
	setValue(obj) {
		this.$view.innerHTML = "";
		const formatter = new JSONFormatter(obj, this.config.viewerConfig.open, this.config.viewerConfig);
		this.$view.appendChild(formatter.render());
		webix.delay(() => {
			this._set_size();
		}, 100);
	}
}, webix.ui.template);
