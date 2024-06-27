define([
    "app",
    "libs/lodash/lodash.min",
    "constants",
    "models/approved_metadata"
], function(
    app, 
    lodash, 
    constants,
    approvedMetadataModel
) {
    const filterData = function(data) {
        const dataToDisplay = lodash.cloneDeep(data);
        const arrayOfServiceMetadata = constants.HIDDEN_METADATA_FIELDS.slice();
        arrayOfServiceMetadata.forEach((serviceMetadataItem) => {
            lodash.unset(dataToDisplay, serviceMetadataItem);
        });
        const approvedMetadata = approvedMetadataModel.getProps();
        const result = checkApprovedMetadata(dataToDisplay, approvedMetadata);
        return result;
    };

    const checkApprovedMetadata = function(data, approvedMetadata) {
        const dataToDisplay = lodash.cloneDeep(data);
        approvedMetadata.forEach((property) => {
            if (dataToDisplay[property?.value] !== null
                && dataToDisplay[property?.value] !== undefined
                && !property.checked
            ) {
                if (property?.data?.length > 0) {
                    dataToDisplay[property.value] = checkApprovedMetadata(dataToDisplay[property.value], property.data);
                    if (lodash.isEmpty(dataToDisplay[property.value]) || dataToDisplay[property.value] === null) {
                        delete dataToDisplay[property.value];
                    }
                } else {
                    if (Array.isArray(dataToDisplay)) {
                        dataToDisplay[property.value] = null;
                    }
                    else {
                        delete dataToDisplay[property.value];
                    }
                }
            }
            else if (
                dataToDisplay[property?.value] === null
                || dataToDisplay[property?.value] === undefined
            ) {
                delete dataToDisplay[property.value];
            }
        });
        return Array.isArray(dataToDisplay) 
            ? dataToDisplay.filter((d) => d !== undefined && d!== null)
            : dataToDisplay;
    };

    return {
        filterData: filterData
    };
});
