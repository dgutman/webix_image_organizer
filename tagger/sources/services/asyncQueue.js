export default class AsyncQueue {
	constructor(fn) {
		this.fn = fn;
		this.current = Promise.resolve(false);
	}

	addJobToQueue() {
		this.current = this.current.then(() => this.fn());
	}
}
