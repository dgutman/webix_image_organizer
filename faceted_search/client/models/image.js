define([
    "app",
    "libs/lodash/lodash.min",
    "constants"
], function(
    app, 
    lodash, 
    constants
) {
    const filterData = function(data) {
        const dataToDisplay = lodash.cloneDeep(data);
        const arrayOfServiceMetadata = constants.HIDDEN_METADATA_FIELDS.slice();
        arrayOfServiceMetadata.forEach((serviceMetadataItem) => {
            lodash.unset(dataToDisplay, serviceMetadataItem);
        });
        return dataToDisplay;
    };

    return {
        filterData: filterData
    };
});
