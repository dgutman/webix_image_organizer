define([], function() {
	'use strict';
	return class MathCalculations {
		static mapLinear(x, a1, a2, b1, b2, clamp) {
			const output = b1 + (x - a1) * (b2 - b1) / (a2 - a1);
			if (clamp) {
				const min = Math.min(b1, b2);
				const max = Math.max(b1, b2);
				return Math.max(min, Math.min(max, output));
			}
	
			return output;
		}
	}
});