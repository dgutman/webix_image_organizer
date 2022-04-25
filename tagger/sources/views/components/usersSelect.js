import {JetView} from "webix-jet";
import templates from "../templates";

const CARDS_TEMPLATE_ID = "users-select:cards";
const MULTI_COMBO_ID = "users-select:multi-combo";

export default class UsersSelect extends JetView {
	constructor(app, usersCollection, config) {
		super(app);
		this._cnf = config;
		this._usersCollection = usersCollection;
		this._selectedUsersMap = new Map();
	}

	config() {
		return {
			...this._cnf,
			name: "usersSelectLayout",
			rows: [
				{
					borderless: true,
					css: "users-cards-template",
					localId: CARDS_TEMPLATE_ID,
					height: 40,
					hidden: true,
					template: (obj) => {
						const users = obj.users || [];
						return users
							.map(user => templates.getUsersCard(user.name, user.id))
							.join("");
					}
				},
				{
					view: "multiCombo",
					name: this._cnf.name,
					css: "search-field",
					localId: MULTI_COMBO_ID,
					placeholder: "Please, select the users",
					filterValue: "nameAndLogin",
					invalidMessage: "Please, select the users",
					inputHeight: 34
				}
			]
		};
	}

	ready() {
		this._multiCombo = this.$$(MULTI_COMBO_ID);
		this._cardsTemplate = this.$$(CARDS_TEMPLATE_ID);

		this._multiCombo.getPopupList().sync(this._usersCollection);
		this._attachSelectEvents();
	}

	setValues(users, blockRepainting) {
		this._selectedUsersMap.clear();
		users.forEach((user) => {
			this.add(user, true);
		});

		if (!blockRepainting) {
			this.repaintCards();
		}
	}

	add(user, blockRepainting) {
		this._selectedUsersMap.set(user._id, user);

		if (!blockRepainting) {
			this.repaintCards();
		}
	}

	repaintCards() {
		const users = this.getValues();

		this._cardsTemplate.setValues({users});
		const areCardsVisible = this._cardsTemplate.isVisible();
		if (!users.length && areCardsVisible) {
			this._cardsTemplate.hide();
		}
		else if (!areCardsVisible) {
			this._cardsTemplate.show();
		}
	}

	_attachSelectEvents() {
		const template = this._cardsTemplate;
		const combo = this._multiCombo;

		template.define("onClick", {
			"preview-info": (ev, id, node) => {
				const _id = node.getAttribute("user_id");
				combo.customUnselect(_id);
			}
		});
		combo.attachEvent("customSelectChange", (ids) => {
			const users = ids.map(userId => this._usersCollection
				.find(user => +userId === +user.id, true));
			this.setValues(users);
		});
	}

	getValues() {
		return Array.from(this._selectedUsersMap.values());
	}
}
