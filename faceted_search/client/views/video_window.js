define([
    "constants",
    "helpers/base_jet_view"
], function(
    constants,
    BaseJetView
) {
    return class VideoWindow extends BaseJetView {
        constructor(app) {
            super(app);
            this.$ondestroy = () => {
                return this.destroy();
            };
        }
        
        get $ui() {
            return {
                view: "window",
                move: "true",
                modal: "false",
                position: "center",
                width: 960,
                height: 540,
                resize: true,
                id: this._rootId,
                head: {
                    view: "toolbar",
                    cols: [
                        {gravity: 5},
                        {
                            view: "label",
                            label: "Tutorial"
                        },
                        {gravity: 5},
                        {
                            view: "button",
                            label: "Close",
                            click: () => {
                                this.getRoot().close();
                            }
                        }
                    ]
                },
                body: {
                    view: "iframe", 
                    id: "frame-body", 
                    src: constants.TUTORIAL_LINK
                }
            };
        }

        showWindow() {
            this.getRoot().show();
        }
    };
});
