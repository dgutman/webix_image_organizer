define([

], function() {
	return class BaseSliderTitle {
		static getTemplate(title) {
			return function getBaseSliderTitle({value}) {
				return `<span>${title}</span> <span>${value.toFixed(2)}</span>`;
			};
		};
	};
});
