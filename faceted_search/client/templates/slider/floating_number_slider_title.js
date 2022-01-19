define([

], function() {
	return class FloatingNumberSliderTitle {
		static getTemplate(title) {
			return function getFloatingNumberSliderTitle({value}) {
				if (value > 0 && value < 1) {
					value = value.toFixed(2);
				}
				return `<span>${title}</span> <span>${value}</span>`;
			};
		}
	};
});
