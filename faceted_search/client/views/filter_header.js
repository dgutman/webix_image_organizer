define([
    "models/images",
    "views/filter_breadcrumbs",
    "views/toolbar",
    "views/user_panel",
    "app",
    "helpers/authentication",
    "views/filter_form",
    "views/filter_button",
    "views/components/header_label"
], function(Images, breadcrumbs, modeToolbar, userPanel, app, auth, filterFormView, filterButtonView, HeaderLabel) {
    window.img = Images;
    const toolbarId = "filter_toolbar";
    const toggleFilterId = 'toggle_filter_id';
    const filterCellPopupId = 'filter_form_popup_id';
    const filterCellId = "filter_cell";
    const rowViewButtonId = 'row_view_button_id';
    const colViewButtonId = 'col_view_button_id';
    const toggleFilterIcon = {
        view: 'icon',
        id: toggleFilterId,
        icon: 'mdi mdi-filter',
        click: function() {
            $$(filterCellPopupId).show(this.getNode());
        }
    };
    const filterCellPopup = {
        view: 'popup',
        id: filterCellPopupId,
        body: {
            minWidth: 200,
            id: filterCellId,
            maxWidth: 400,
            hidden: !auth.isLoggedIn(),
            rows: [
                filterFormView,
                filterButtonView
            ]
        }
    };

    const headerLabel = new HeaderLabel()

    const ui = {
        view: "toolbar",
        id: toolbarId,
        rows: [
            {
                id: "a1",
                rows: [
                    {
                        responsive: "a1",
                        cols: [
                            headerLabel,
                            {gravity: 10, height: 1},
                            {
                                view: "label",
                                id: "view_label",
                                label: "View",
                                align: "left",
                                width: 50
                            },
                            {
                                view: "icon",
                                id: rowViewButtonId,
                                icon: "mdi mdi-table",
                                click: function() {
                                    Images.changeImagesViewState(false);
                                    this.disable();
                                    $$(colViewButtonId).enable();
                                }
                            },
                            {
                                view: "icon",
                                id: colViewButtonId,
                                icon: "mdi mdi-table-column",
                                click: function() {
                                    Images.changeImagesViewState(true);
                                    this.disable();
                                    $$(rowViewButtonId).enable();
                                }
                            },
                            modeToolbar,
                            toggleFilterIcon,
                            userPanel
                        ]
                    }
                ]
            },
            breadcrumbs
        ]
    };

    app.ui(filterCellPopup);

    return {
        $ui: ui,
        $oninit: function() {
            let state = Images.getImagesViewState();
            if(state) {
                $$(rowViewButtonId).enable();
                $$(colViewButtonId).disable();
            }else{
                $$(rowViewButtonId).disable();
                $$(colViewButtonId).enable();
            }
            $$(rowViewButtonId).render();
            $$(colViewButtonId).render();
        }
    };
});
