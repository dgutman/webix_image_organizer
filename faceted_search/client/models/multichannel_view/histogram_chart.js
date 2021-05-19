define([
	"helpers/base_jet_view",
	"libs/lodash/lodash.min.js"
], function(
	BaseJetView,
	lodash
) {
	'use strict';

	const chart = (data) => {
		const margin = ({top: 20, right: 0, bottom: 40, left: 60});
		const height = 190;
		const width = 330;

		const y = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => d.value)]).nice()
		.range([height - margin.bottom, margin.top]);

		const x = d3.scaleBand()
			.domain(data.map((d) => d.name))
			.range([margin.left, width - margin.right])
			.padding(0);

		const yAxis = (g) => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
			.call((g) => g.select(".domain").remove());

		const xAxis = (g) => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(fc.axisLabelRotate(fc.axisOrdinalBottom(x))
			.tickValues(
				x.domain()
					.filter((d, i, arr) => {
						return (arr.length > 10 && !(i%10) && i <= arr.length - 10) ||
							i === arr.length - 1 ||
							arr.length < 10;
					})
			)
			.tickSizeOuter(0));

		const zoom = (svg) => {
			const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

			const zoomed = (event) => {
				x.range([margin.left, width - margin.right].map((d) => event.transform.applyX(d)));
				svg.selectAll(".bars rect").attr("x", (d) => x(d.name)).attr("width", x.bandwidth());
				svg.selectAll(".x-axis").call(xAxis);
			};

			svg.call(d3.zoom()
				.scaleExtent([1, 40])
				.translateExtent(extent)
				.extent(extent)
				.on("zoom", zoomed));
		};

		const svg = d3.create("svg")
			.attr("viewBox", [0, 0, width, height])
			.call(zoom);

		svg.append("g")
			.attr("class", "bars")
			.attr("fill", "steelblue")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.attr("x", (d) => x(d.name))
			.attr("y", (d) => y(d.value))
			.attr("height", (d) => y(0) - y(d.value))
			.attr("width", x.bandwidth());

		svg.append("g")
			.attr("class", "x-axis")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y-axis")
			.call(yAxis);

		return svg.node();
	};

	return class D3Chart extends BaseJetView {
		constructor(app, config) {
			super(app);
			this._cnf = config;
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				template: () => {
					return "";
				}
			};
		}

		makeChart(data) {
			const template = this.$chartTemplate();
			template.refresh();
			if (lodash.isEmpty(data)) {
				return;
			}
			const templateNode = template.getNode();
			templateNode.innerHTML = "";
			templateNode.appendChild(chart(data));
		}

		$chartTemplate() {
			return $$(this._rootId);
		}
	};
});
