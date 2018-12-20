let treeview;
let dataview;
let pager;
let datatable;
let mainView;

function setMainView(view) {
	mainView = view;
}

function setDataview(dataView) {
	dataview = dataView;
}

function setDatatable(datatableView) {
	datatable = datatableView;
}

function setTreeview(treeView) {
	treeview = treeView;
}

function setPagerView(pagerView) {
	pager = pagerView;
}

function getDataview() {
	return dataview;
}

function getDatatable() {
	return datatable;
}

function getTree() {
	return treeview;
}

function getPager() {
	return pager;
}

function getMainView() {
	return mainView;
}

export default {
	setDataview,
	setDatatable,
	setTreeview,
	setPagerView,
	getDataview,
	getDatatable,
	getTree,
	getPager,
	setMainView,
	getMainView
};