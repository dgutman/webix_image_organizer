define([
	"constants"
], function(
	constants
) {
	const handleIconSelect = (view, id, fieldName, isInverse) => {
		const element = view.getItem(id);
		const data = view.data;
		let isChecked = isInverse ? !element[fieldName] : element[fieldName];
		element[fieldName] = !element[fieldName];
		isChecked = !isChecked;
		element.iconState = isChecked ? constants.CHECKBOX_STATE.checked : constants.CHECKBOX_STATE.blank;
		changeChildrenState(id, data, isChecked, fieldName, isInverse);
		const parent = view.getItem(element.$parent);
		if (parent) {
			setParentsElementIcon(view, parent, fieldName, isChecked, isInverse);
		}
		view.render();
	};
	
	const changeChildrenState = (id, data, isChecked, fieldName, isInverse) => {
		data.eachChild(id, function(child) {
			child[fieldName] = isInverse ? !isChecked : isChecked;
			child.iconState = isChecked
				? constants.CHECKBOX_STATE.checked 
				: constants.CHECKBOX_STATE.blank;
			if(data.getBranch(child.id).length > 0) {
				changeChildrenState(child.id, data, isChecked, fieldName, isInverse);
			}
		});
	};
	
	function setParentsElementIcon(view, element, fieldName, isChecked, isInverse) {
		setElementIcon(view, element, fieldName, isChecked, isInverse);
		const parent = view.getItem(element.$parent);
		if (parent) {
			setParentsElementIcon(view, parent, fieldName, isChecked, isInverse);
		}
	}
	
	function setElementIcon(view, element, fieldName, isChecked, isInverse) {
		const data = view.data;
		const children = data.getBranch(element.id);
		if (children?.length) {
			const checkedChildrenCount = children.reduce((count, child) => {
				const isChildChecked = isInverse ? !child[fieldName] : child[fieldName];
				if (isChildChecked) {
					count++;
				}
				return count;
			}, 0);
			const isMinus = !!(children.reduce((count, child) => {
				return count + (child.iconState ?? 0); // blank state is 0
			}, 0));
			if (checkedChildrenCount === children.length) {
				element.iconState = constants.CHECKBOX_STATE.checked;
			}
			else if (isMinus) {
				element.iconState = constants.CHECKBOX_STATE.minus;
			}
			else {
				element.iconState = constants.CHECKBOX_STATE.blank;
			}
		}
		else {
			element.iconState = isChecked
				? constants.CHECKBOX_STATE.blank
				: constants.CHECKBOX_STATE.checked;
		}
	}
	return {
		handleIconSelect,
		setElementIcon
	};
});
