define([],
	function() {
		"use strict";
		const settings = ["Show all channels"];

		for (let i = 1; i < 36; i++) {
			settings.push(`Show channel ${i}`);
		}
		return settings;
	}
);
