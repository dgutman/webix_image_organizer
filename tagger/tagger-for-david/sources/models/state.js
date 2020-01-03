import globalEvents from "../services/globalEvents";

/*
 this object we use for saving state for pages. For example, userinfo after authentification
 */
const state = {
	app: {}, // init in app.js
	globalEvents
};

export default state;
