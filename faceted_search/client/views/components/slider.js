define([
	"helpers/base_jet_view"
], function(BaseJetView) {
	return class Slider extends BaseJetView {
		constructor(app, config) {
			super(app, config);
	
			this._cnf = config;
			this._currentValue = null;
			this._sliderView = null;
		}

		get $ui() {
			const events = this._cnf.on || {};
			return {
				...this._cnf,
				id: this._rootId,
				on: {
					...events,
					onSliderDrag: () => {
						const value = this.$slider().getValue();
						this._callCustomDragEvent(value);
					},
					onChange: (value) => {
						this._callCustomDragEvent(value);
					}
				},
				view: "slider",
				localId: this._sliderViewId
			};
		}

		get _sliderViewId() {
			return "sliderViewId";
		}
	
		_callCustomDragEvent(value) {
			if (this._currentValue !== value) {
				this._currentValue = value;
				this.$slider().callEvent("onSliderDragging", [value]);
			}
		}
	
		$slider() {
			if (!this._sliderView) {
				this._sliderView = this.$$(this._sliderViewId);
			}
			return this._sliderView;
		}
	};
});
