import * as d3 from "d3";
import lodash from "lodash";
import {JetView} from "webix-jet";

import constants from "../../constants";

export default class D3Chart extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this._cnf = config;
		this.width = config.width || 330;
		this.height = config.height || 190;
		this.localId = config.localId;
	}

	config() {
		return {
			...this._cnf,
			css: "histogram-chart",
			template: () => ""
		};
	}

	makeChart(data, yScaleType) {
		const template = this.$chartTemplate();
		template.refresh();
		if (lodash.isEmpty(data)) {
			return;
		}
		const templateNode = template.getNode();
		templateNode.innerHTML = "";
		templateNode.appendChild(this._renderChart(data, yScaleType));
		webix.TooltipControl.addTooltip(templateNode);
	}

	_getYScale(yScaleType, data, height, margin) {
		if (yScaleType === constants.LOGARITHMIC_SCALE_VALUE) {
			return d3.scaleLog()
				.domain([1, d3.max(data, d => d.value)])
				.nice()
				.range([height - margin.bottom, margin.top]);
		}
		return d3.scaleLinear()
			.domain([1, d3.max(data, d => d.value)])
			.nice()
			.range([height - margin.bottom, margin.top]);
	}

	_renderChart(data, yScaleType) {
		const margin = {top: 20, right: 20, bottom: 40, left: 60};
		const height = this.height;
		const width = this.width;
		const y = this._getYScale(yScaleType, data, height, margin);
		const x = d3.scaleBand()
			.domain(data.map(d => d.name))
			.range([margin.left, width - margin.right])
			.padding(0.1);

		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
			.call(g => g.select(".domain").remove());

		const dataNameLengths = data.map(obj => obj.name.length);
		const maxNameChars = Math.max(...dataNameLengths);

		const xAxis = g => g
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x)
				.tickValues(
					x.domain()
						.filter((d, i) => {
							const textMaxWidth = maxNameChars * 10;
							const barWidth = x.bandwidth();
							const denominator = textMaxWidth / barWidth;
							return !(i % Math.floor(Math.max(denominator, 1)));
						})
				)
				.tickSizeOuter(0));

		const zoom = (svg) => {
			const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

			const zoomed = (event) => {
				x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
				svg.selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
				svg.selectAll(".bg-bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
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
			.attr("x", d => x(d.name))
			.attr("y", d => (d.value !== 0 ? y(d.value) : 0))
			.attr("height", d => (d.value !== 0 ? y(1) - y(d.value) : 0))
			.attr("width", x.bandwidth());

		svg.append("g")
			.attr("class", "bg-bars")
			.attr("fill", "#9aedf23b")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.attr("x", d => x(d.name))
			.attr("y", margin.top)
			.attr("height", height - margin.top - margin.bottom)
			.attr("width", x.bandwidth())
			.attr("webix_tooltip", (d, i) => {
				const minEdge = data[i - 1] ? data[i - 1].name : 0;
				return `
					Count: <br />
					${d.value} <br />
					Bin edges: <br />
					${minEdge} - ${d.name}`;
			})
			.attr("class", "bg-bar");

		svg.append("g")
			.attr("class", "x-axis")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y-axis")
			.call(yAxis);

		return svg.node();
	}

	$chartTemplate() {
		return this.getRoot();
	}
}
