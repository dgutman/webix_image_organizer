/* eslint-disable max-len */
define([
    "models/whitelist",
    "constants"
], function(whitelistModel, constants) {
    const filterMetadataViewId = "filter_metadata_view_id";
    const metadataGrouplistId = "metadata-grouplist-id";

    const handleIconSelect = (view, id) => {
        let element = view.getItem(id);
        let data = view.data;
        if(element.checked === true) {
            element.checked = false;
        } else {
            element.checked = true;
        }
        checkData(id, data, element.checked);
        view.render();
    };

    const checkData = (id, data, check) => {
        data.eachChild(id, function(child) {
            child.checked = check;
            if(data.getBranch(child.id).length > 0) {
                checkData(child.id, data, check);
            }
        });
    };

    const whitelistPopup = {
        view: 'popup',
        id: constants.WHITELIST_POPUP_ID,
        body: {
            view: "scrollview",
            id: filterMetadataViewId,
            minWidth: 200,
            maxWidth: 400,
            minHeight: 300,
            maxHeight: 500,
            body: {
                rows: [
                    {
                        view: "textarea",
                        value: "Prease select the metadata which\n" +
                            "should be displayed in the User Mode:"
                    },
                    {
                        view: "grouplist",
                        id: metadataGrouplistId,
                        scroll: "auto",
                        navigation: false,
                        gravity: 10,
                        select: false,
                        drag: "source",
                        templateGroup: ({value, id, checked}, common) => `<div style="width:100$; display: flex">
                        <span class='metadata-grouplist__group-value'>${value}</span> ${common.checkboxState(checked)} <span>Select all</span>
                        </div>`,
                        templateItem: ({value, id, checked}, common) => `<div style="width: 100%; display: flex">
                        <span class='metadata-grouplist__item-value'>${value}</span> ${common.checkboxState(checked)}
                        </div>`,
                        type: {
                            checkboxState: (checked) => {
                                const icon = checked ? "checkbox mdi mdi-checkbox-marked" : "checkbox mdi mdi-checkbox-blank-outline";
                                return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
                            }
                        },
                        onClick: {
                            checkbox: function(ev, id) {
                                handleIconSelect(this, id);
                                return false;
                            }
                        }
                    },
                    {
                        view: "button",
                        id: "confurm-button",
                        value: "Confirm",
                        click: function() {
                            whitelistModel.saveWhitelist($$(metadataGrouplistId).data.serialize());
                            $$(constants.WHITELIST_POPUP_ID).hide();
                        }
                    }
                ]
            }
        }
    };

    return whitelistPopup;
});
