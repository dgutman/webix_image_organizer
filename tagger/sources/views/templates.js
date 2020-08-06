function getDataviewOverlay(text) {
	return `<div class='data-subview-overlay'>
				<span class='overlay-text'>${text}</span>
			</div>`;
}

function getDashboardActionsCol(obj) {
	if (obj._modelType === "task") {
		return `<div class='dashboard-action-buttons'>
					<button class='webixtype_base dashboard-button pattern-on-button'>Pattern on</button>
					<i class='fas fa-pencil-alt icon-button edit-button'></i>
					<i class='fas fa-trash icon-button delete-button'></i>
				</div>`;
	}
	return "";
}

function getUsersCard(userName, id) {
	const preview = userName
		.split(" ")
		.map(str => str[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
	if (userName) {
		return `<div class='user-card'>
					<div user_id='${id}' class='preview-info'>
						${preview}
						<span class='delete-icon fas fa-times'></span>
					</div>
					<span class='hidden-info'>${userName}</span>
				</div>`;
	}
	return "";
}

function getUserProgressTemplate(obj) {
	if (obj.name) {
		const userTemplate = obj.users.map((user) => {
			const usersProgress = obj._progress.find(data => data._id === user._id) || {};
			const percents = ((usersProgress.reviewed || 0) / (obj.count || 1)) * 100;
			const roundedPercents = percents < 1 ? Math.ceil(percents) : Math.floor(percents);
			return `<div class='users-progress'>
						<div class='users-name'>${user.name}:</div>
						<div class='progress-bar'>
						<span class='bar'>
							<span class='progress-text'>${roundedPercents}%</span>
							<span class='progress' style='width: ${roundedPercents}%;'></span>
						</span>
						</div>
					</div>
					<div>
						${obj._latest}
					</div>`;
		}).join("");
		return `<div class='results-template'>
			<b class='task-name strong-font'>${obj.name}</b>
			<div>
				<b class='strong-font'>Task completion:</b>
			</div>
			${userTemplate}
		</div>`;
	}
	return "";
}

function getTagsStatisticTemplate(obj) {
	if (obj.tags) {
		const template = obj.tags.map((tag) => {
			const valuesTemplate = tag.values
				.map(val => `<div class='value-container'>
								<div class='value-name'>${val.value}</div>
								<div class='value-count'>${val.count}/${obj.reviewed}</div>
							</div>`).join("");
			return `<div class='tag-container'>
						<div class='tag-name'>${tag.name}</div>
						<div class='tag-values'>${valuesTemplate}</div>
					</div>`;
		}).join("");
		return `<div class='tags-statistic-header'><span>Tags/values name</span><span>Values</span></div> ${template}`;
	}
	return "";
}

export default {
	getDataviewOverlay,
	getDashboardActionsCol,
	getUsersCard,
	getUserProgressTemplate,
	getTagsStatisticTemplate
};
