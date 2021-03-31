export default class TimedOutBehavior {
	constructor(timeout) {
		this.job = null;
		this.timeout = timeout || 200;
	}

	execute(fn, context, args) {
		const funcArgs = args || [];
		this.job = {
			fn: fn.bind(context, ...funcArgs)
		};
		this.fn = fn;
		this.refreshTimer();
	}

	refreshTimer() {
		if (this.timeOutId) {
			clearTimeout(this.timeOutId);
			this.timeOutId = null;
		}
		this.timeOutId = setTimeout(() => {
			if (this.job) {
				this.job.fn();
			}
		}, this.timeout);
	}
}
