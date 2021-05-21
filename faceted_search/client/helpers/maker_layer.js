define([], function() {
	return class MakerLayer {
		static makeLayer(layer) {
			return Object.assign({}, layer, {
				opacity: 1,
				colorize: 0,
				hue: 0,
				erosionKernel: 1,
				shimX: 0,
				shimY: 0,
				brightness: 0,
				contrast: 0,
				blackLevel: 0,
				whiteLevel: 255,
				imgProcess: 1,
				lowThreshold: 0,
				highThreshold: 255,
				rotation: 0,
				markers: [],
				shown: true
			});
		}
	};
});
