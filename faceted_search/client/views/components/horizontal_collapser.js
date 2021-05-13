define([
	"helpers/base_jet_view",
	"libs/vanilla-picker/vanilla-picker"
], function(BaseJetView) {
	'use strict';

	const RIGHT_DIRECTION = "right";
	const LEFT_DIRECTION = "left";

	return class HorizontalCollapser extends BaseJetView {
		constructor(app, config = {}) {
			super(app, config);
			this._cnf = config;
			this._direction = this._cnf.direction || LEFT_DIRECTION;

			this.$oninit = () => {
				const iconDirection = [
					"<div class='svg-icon arrow-left'></div>",
					"<div class='svg-icon arrow-right'></div>"
				];
				let [openedState, closedState] = iconDirection;
				if (this._direction === RIGHT_DIRECTION) {
					[closedState, openedState] = iconDirection;
				}

				this._findLinkedView().then((view) => {
					this._collapsed = !view.isVisible();
					this.getRoot().setValues({openedState, closedState});
				});
			};
		}
	
		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				width: 20,
				css: "collapser",
				view: "template",
				template: ({closedState, openedState}) => {
					return `<div class="collapser-body">
						${this._collapsed ? closedState : openedState}
					</div>`;
				},
				onClick: {
					"collapser-body": () => {
						this.toggle();
					}
				}
			};
		}

		toggle() {
			this._findLinkedView().then((view) => {
				if (view.isVisible()) {
					this.collapse();
				} else {
					this.expand();					
				}
			});
		}

		expand() {
			this._findLinkedView().then((view) => {
				view.show();
				this._collapsed = false;
				this.getRoot().refresh();
			});
		}

		collapse() {
			this._findLinkedView().then((view) => {
				view.hide();
				this._collapsed = true;
				this.getRoot().refresh();
			});
		}

		_findLinkedView() {
			return new Promise((resolve, reject) => {
				const root = this.getRoot();
				const parent = root.getParentView();
				const siblings = parent.getChildViews();
				const rootIndex = siblings.findIndex((view) => view === root);

				const linkedViewIndex = this._direction === RIGHT_DIRECTION ? rootIndex + 1 : rootIndex - 1;
				const linkedView = siblings[linkedViewIndex];
				if (linkedView) {
					return resolve(linkedView);
				}
				reject(null);
			});
		}

		get _collapsed() {
			return this._cnf.collapsed;
		}

		set _collapsed(value) {
			this._cnf.collapsed = value;
		}
	};
});
