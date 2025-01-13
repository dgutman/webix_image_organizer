const paperjs = new Proxy({
	paper: window.paper,
	wrapper: Object.assign({}, window.paper)
}, {
	defineProperty(target, prop, descriptor) {
		Object.defineProperty(target.wrapper[prop], prop, descriptor);
	},
	set(target, prop, newValue) {
		target.wrapper[prop] = newValue;
	},
	get(target, prop) {
		if (target.wrapper[prop]) {
			return target.wrapper[prop];
		}
		return target.paper[prop];
	}
});
export default paperjs;
