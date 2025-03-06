module.exports = {
    SKINS: {
        'compact': 'compact',
        'terrace': 'terrace'
    },
    ALL_IMAGES_RES_PATH: './tmp/images.json',
    CHANNEL_MAP_FILTER: "meta|ioparams|channelmap",
    CHANNEL_MAP_FIELD: "channelmap",
    HIDDEN_METADATA_FIELDS: [
        "_id",
        "name",
        "meta.ioparams.channelmap",
        "meta.ioparams.thumbnailUrl",
        "largeImage"
    ],
    RESYNC: "[RESYNC]",
    FILTER_STATUS: {
        MODIFIED: "modified",
        ADDED: "added",
        ALREADY_ADDED: "already_added",
        REMOVED: "removed",
    },
};
