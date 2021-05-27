define([
	"helpers/base_jet_view",
	"libs/lodash/lodash.min.js"
], function(
	BaseJetView,
	lodash
) {
	'use strict';
	const {d3} = window;

	return class D3Chart extends BaseJetView {
		constructor(app, config) {
			super(app);
			this._cnf = config;
			this.width = config.width || 330;
			this.height = config.height || 190;
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
			templateNode.appendChild(this._renderChart(data));
		}

		_renderChart(data) {
			const margin = ({top: 20, right: 20, bottom: 40, left: 60});
			const height = this.height;
			const width = this.width;
	
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
				.call(d3.axisBottom(x)
				.tickValues(
					x.domain()
						.filter((d, i, arr) => {
							const textMaxWidth = 50;
							const barWidth = x.bandwidth();
							const denominator = textMaxWidth / barWidth;
							return !(i%Math.floor(Math.max(denominator, 1)));
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
				.attr("width", x.bandwidth())
				.append("svg:title")
				.text((d) => d.value);
	
			svg.append("g")
				.attr("class", "x-axis")
				.call(xAxis);
	
			svg.append("g")
				.attr("class", "y-axis")
				.call(yAxis);
	
			return svg.node();
		}

		$chartTemplate() {
			return $$(this._rootId);
		}
	};
});
