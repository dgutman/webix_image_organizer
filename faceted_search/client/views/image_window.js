define([
    "helpers/ajax",
    "libs/is/is.min",
    "templates/image",
    "libs/openseadragon/openseadragon.min.js"
], function(ajax, is, imageTemplate, openseadragon) {
    const windowWidthRatio = 0.7;
    const windowWidthAdditionalRatio = 0.8;
    const imageWidthRation = 0.4;
    const windowHeightRatio = 0.28;
    const propertyListWidthRatio = 0.42;

    const windowId = webix.uid();
    const openseadragonTemplateId = `openseadragon-template-${windowId}`;

    function showWindow(data) {
        const hasLargeImage = !!data.data.largeImage;

        webix.ui({
            view: "window",
            id: windowId,
            position: "center",
            width: window.innerWidth * windowWidthRatio * windowWidthAdditionalRatio,
            height: window.innerWidth * windowHeightRatio,
            move: true,
            modal: true,
            scroll: 'x',
            head: {
                view: "toolbar",
                cols: [
                    {
                        view: "label",
                        label: data.data.name
                    },
                    {
                        view: "button",
                        label: "Close",
                        width: 100,
                        align: "right",
                        click() {
                            $$(windowId).close();
                        }
                    }
                ]
            },
            body: {
                view: 'scrollview',
                scroll: 'x',
                body: {
                    cols: [
                        {
                            rows: [
                                getImageTemplate(hasLargeImage, data)
                            ]
                        },
                        getPropertyList(data.data)
                    ]
                }
            },
            on: {
                onShow() {
                    if (hasLargeImage) {
                        const imageId = data.data._id;
                        ajax.getImageTiles(imageId)
                          .then((tiles) => initOpenseadragon(imageId, tiles));
                    }
                }
            }
        }).show();
    }

    function getPropertyList(data) {
        return {
            view: "property",
            editable: false,
            scroll: true,
            nameWidth: 180,
            width: window.innerWidth * propertyListWidthRatio,
            elements: buildProperties([], data, '')
        };
    }

    function buildProperties(array, data, prefix) {
        array.push({
            label: (prefix === '') ? "Main" : prefix,
            type: "label"
        });

        if (prefix !== '') {
            prefix += '/';
        }

        const keys = Object.keys(data);
        const length = keys.length;

        // for string values
        for (let i = 0; i < length; i++) {
            const key = keys[i];

            if (is.not.object(data[key])) {
                array.push(
                    {
                        label: key,
                        value: data[key],
                        type: 'text'
                    }
                );
            }
        }

        // for object values
        for (let i = 0; i < length; i++) {
            const key = keys[i];

            if (is.object(data[key])) {
                array = buildProperties(array, data[key], prefix + key);
            }
        }

        return array;
    }

    function getImageTemplate(isLargeImage, data) {
        let generalTemplateConfig = {
            css: 'popup-img',
            template: () => imageTemplate.getTemplate(data)
        };

        if (isLargeImage) {
            generalTemplateConfig = {
                css: "openseadragon-template-image",
                id: openseadragonTemplateId
            };
        }

        return {
            view: "template",
            width: window.innerWidth * windowWidthRatio * imageWidthRation,
            ...generalTemplateConfig
        };
    }

    function initOpenseadragon(imageId, tiles) {
        const openseadragonTemplate = $$(openseadragonTemplateId);
        openseadragon({
            element: openseadragonTemplate.getNode(),
            crossOriginPolicy: "Anonymous",
            prefixUrl: "libs/openseadragon/images/",
            loadTilesWithAjax: true,
            imageLoaderLimit: 1,
            tileSources: {
                width: tiles.sizeX,
                height: tiles.sizeY,
                tileWidth: tiles.tileWidth,
                tileHeight: tiles.tileHeight,
                minLevel: 0,
                maxLevel: tiles.levels - 1,
                getTileUrl(level, x, y) {
                    return ajax.getImageTileUrl(imageId, level, x, y);
                }
            }
        });
    }

    return {
        showWindow
    };
});
