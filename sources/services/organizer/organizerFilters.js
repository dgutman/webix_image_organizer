import OpenSeadragon from "openseadragon";


export default class OrganizerFilters {
	mapLinear(x, a1, a2, b1, b2, clamp) {
		const output = b1 + (x - a1) * (b2 - b1) / (a2 - a1);
		if (clamp) {
			const min = Math.min(b1, b2);
			const max = Math.max(b1, b2);
			return Math.max(min, Math.min(max, output));
		}

		return output;
	}

	getFilterProcessors(layer) {
		let processors = [];
		if (layer.brightness) {
			let brightness = this.mapLinear(layer.brightness, -1, 1, -255, 255, true);
			processors.push(OpenSeadragon.Filters.BRIGHTNESS(brightness));
		}

		if (layer.contrast) {
			let contrast = layer.contrast < 0 ?
				this.mapLinear(layer.contrast, -1, 0, 0, 1, true) :
				this.mapLinear(layer.contrast, 0, 1, 1, 5, true);

			processors.push(OpenSeadragon.Filters.CONTRAST(contrast));
		}

		if (
			layer.blackLevel !== undefined &&
            layer.whiteLevel !== undefined &&
            (layer.blackLevel > 0 || layer.whiteLevel < 255)
		) {
			let precomputedLevels = [];
			for (let i = 0; i < 256; i++) {
				precomputedLevels[i] = Math.round(
					this.mapLinear(i, layer.blackLevel, layer.whiteLevel, 0, 255, true)
				);
			}

			processors.push((context, callback) => {
				this.processPixels(context, (r, g, b, a) => {
					r = precomputedLevels[r];
					g = precomputedLevels[g];
					b = precomputedLevels[b];

					return [r, g, b, a];
				});

				callback();
			});
		}

		if (layer.colorize) {
			processors.push((context, callback) => {
				context.save();
				context.fillStyle = `hsl(${layer.hue}, 100%, 50%)`;
				context.globalCompositeOperation = "color";
				context.globalAlpha = layer.colorize;
				context.fillRect(0, 0, context.canvas.width, context.canvas.height);
				context.restore();
				callback();
			});
		}

		if (
			layer.lowThreshold !== undefined &&
            layer.highThreshold !== undefined &&
            (layer.lowThreshold > 0 || layer.highThreshold < 255)
		) {
			processors.push((context, callback) => {
				this.processPixels(context, (r, g, b) => {
					let average = (r + g + b) / 3;
					if (average < layer.lowThreshold || average > layer.highThreshold) {
						return [r, g, b, 0];
					}

					return null;
				});

				callback();
			});
		}

		if (layer.erosionKernel > 1) {
			processors.push(OpenSeadragon.Filters.MORPHOLOGICAL_OPERATION(layer.erosionKernel, Math.min));
		}

		return processors;
	}

	processPixels(context, iterator) {
		let imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
		let pixels = imgData.data;
		for (let i = 0; i < pixels.length; i += 4) {
			let r = pixels[i];
			let g = pixels[i + 1];
			let b = pixels[i + 2];
			let a = pixels[i + 3];
			let result = iterator(r, g, b, a);
			if (result) {
				pixels[i] = result[0];
				pixels[i + 1] = result[1];
				pixels[i + 2] = result[2];
				pixels[i + 3] = result[3];
			}
		}

		context.putImageData(imgData, 0, 0);
	}

	updateFilters(layers, viewer) {
		let filters = layers.map(layer => ({
			items: layer.tiledImage,
			processors: this.getFilterProcessors(layer)
		}));

		filters = filters.filter(filter => !!filter);

		viewer.setFilterOptions({
			loadMode: "sync",
			filters
		});
	}
}
