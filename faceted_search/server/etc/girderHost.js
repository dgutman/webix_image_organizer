function resolveGirderHost(hostUrl) {
	if (!hostUrl) {
		return hostUrl;
	}
	const girderHost = process.env.GIRDER_HOST;
	if (!girderHost) {
		return hostUrl;
	}
	try {
		const url = new URL(hostUrl);
		if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
			url.hostname = girderHost;
			return url.href.replace(/\/$/, "");
		}
	} catch (e) {
		// leave hostUrl unchanged
	}
	return hostUrl;
}

module.exports = {resolveGirderHost};
