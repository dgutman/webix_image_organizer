const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DATA_TYPES = {
    SKINS: 'skins',
    SKINS_EXTENSIONS: 'skins extensions',
    IMG_HASH: 'images_hash',
    HOSTS: 'hosts',
	DOWNLOADED_RESOURCES: 'downloaded resources'
}

const ServiceDataSchema = new Schema({
    name: { type: String },
    type: { type: String },
    data: Schema.Types.Mixed
});


// skins
ServiceDataSchema.statics.getSkinsList = function() {
    return this.findOne({type: DATA_TYPES.SKINS}).lean();
};

ServiceDataSchema.statics.addSkins = function(skins) {
    return this.getSkinsList()
    .then((result) => {
        if(result) {
            return this.update({type: DATA_TYPES.SKINS}, {data: skins});
        } else {
            const doc = new this({
                name: 'Skins',
                type: DATA_TYPES.SKINS,
                data: skins
            });
            return doc.save();
        }
    });
};

ServiceDataSchema.statics.getSkinExtensionsList = function() {
    return this.findOne({type: DATA_TYPES.SKINS_EXTENSIONS}).lean();
};

ServiceDataSchema.statics.addSkinsExtensions = function(extensions) {
    return this.getSkinExtensionsList()
    .then((result) => {
        if(result) {
            return this.update({type: DATA_TYPES.SKINS_EXTENSIONS}, {data: extensions});
        } else {
            const doc = new this({
                name: 'Skins extensions',
                type: DATA_TYPES.SKINS_EXTENSIONS,
                data: extensions
            });
            return doc.save();
        }
    });
};

// update time
ServiceDataSchema.statics.getImagesHash = function() {
    return this.findOne({type: DATA_TYPES.IMG_HASH}).lean();
};

ServiceDataSchema.statics.updateImagesHash = function(hash) {
    return this.getImagesHash()
    .then((existingHash) => {
        if(existingHash) {
            return this.update({type: DATA_TYPES.IMG_HASH}, {data: hash});
        } else {
            const doc = new this({
                name: 'Last update hash',
                type: DATA_TYPES.IMG_HASH,
                data: hash
            });
            return doc.save();
        }
    });
};

// hosts
ServiceDataSchema.statics.getHostsList = function() {
    return this.findOne({type: DATA_TYPES.HOSTS}).lean();
};

ServiceDataSchema.statics.addHosts = function(hosts) {
    return this.getHostsList()
    .then((result) => {
        if(result) {
            return this.update({type: DATA_TYPES.HOSTS}, {data: hosts});
        } else {
            const doc = new this({
                name: 'Hosts',
                type: DATA_TYPES.HOSTS,
                data: hosts
            });
            return doc.save();
        }
    });
};

// downloaded resources
ServiceDataSchema.statics.getDownloadedResources = function() {
	return this.findOne({type: DATA_TYPES.DOWNLOADED_RESOURCES}).lean();
};

ServiceDataSchema.statics.addResource = function(resource) {
	return this.getDownloadedResources()
	.then((result) => {
		if(result) {
			const resources = [...result.data];
			resources.push(resource);
			return this.update({type: DATA_TYPES.DOWNLOADED_RESOURCES}, {data: resources});
		} else {
			const resources = [];
			resources.push(resource);
			const doc = new this({
				name: 'Downloaded resources',
				type: DATA_TYPES.DOWNLOADED_RESOURCES,
				data: resources
			});
			return doc.save();
		}
	});
};

ServiceDataSchema.statics.clearDownloadedResources = async function() {
	const result = await this.deleteMany({type: DATA_TYPES.DOWNLOADED_RESOURCES});
	return result.ok;
};

ServiceDataSchema.statics.deleteDownloadedResource = async function(id) {
	return this.getDownloadedResources()
	.then((result) => {
		if(result && result.data) {
			const resources = [...result.data];
			const index = result.data.indexOf(id);
			if(index !== -1) {
				resources.splice(index, 1);
			}
			return this.update({type: DATA_TYPES.DOWNLOADED_RESOURCES}, {data: resources});
		}
	});
};

mongoose.model('ServiceData', ServiceDataSchema);

module.exports = mongoose.model('ServiceData');
