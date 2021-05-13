define([
    "helpers/ajax",
    "libs/is/is.min",
    "libs/openseadragon/openseadragon.min.js"
], function(ajax, is, openseadragon) {
    const windowId = webix.uid();
    const openseadragonTemplateId = `openseadragon-template-${windowId}`;

    function showWindow(data) {
        webix.ui({
            view: "window",
            id: windowId,
            position: "center",
            width: 1100,
            height: 500,
            minWidth: 720,
            minHeight: 400,
            modal: true,
            resize: true,
            head: {
                view: "toolbar",
                cols: [
                    {
						view: "label",
						width: 140,
						template: "<img class='app-logo' src='assets/imgs/logo.png'>"
					},
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
                cols: [
                    {
                        view: "template",
                        css: "openseadragon-template-image",
                        minWidth: 400,
                        id: openseadragonTemplateId
                    },
                    {
                        view: 'scrollview',
                        maxWidth: 400,
                        minWidth: 300,
                        body: getPropertyAccordionList(data.data)
                    }
                ]
            },
            on: {
                onShow() {
                    const imageId = data.data._id;
                    const container = $$(openseadragonTemplateId).getNode();

                    if (data.data.largeImage) {
                        ajax.getImageTiles(imageId)
                          .then((tiles) => {
                              initLargeImageOpenseadragon(imageId, tiles, container);
                          });
                    } else {
                        initSimpleImageOpenseadragon(imageId, container);
                    }
                }
            }
        }).show();
    }

    function getPropertyAccordionList(data) {
        return {
            view: "accordion",
            multi: true,
            collapsed: true,
            margin: 0,
            rows: buildProperties([], data, '')
        };
    }

    function getPropertyAccordionItem(prefix, data) {
        return {
            view: "accordionitem",
            header: (prefix === '') ? "Main" : prefix,
            body: {
                view: "datatable",
                header: false,
                scroll: "x",
                autoheight: true,
                columns: [
                    {
                        id: "propertyName",
                        minWidth: 170,
                        adjust: "data"
                    },
                    {
                        id: "propertyValue",
                        minWidth: 230,
                        adjust: "data"
                    }
                ],
                data
            }
        };
    }

    function buildProperties(array, data, prefix) {
        const keys = Object.keys(data);
        const length = keys.length;

        // for string values
        const arrayData = [];
        for (let i = 0; i < length; i++) {
            const key = keys[i];

            if (is.not.object(data[key])) {
                arrayData.push({
                    propertyName: key,
                    propertyValue: data[key]
                });
            }
        }

        array.push(getPropertyAccordionItem(prefix, arrayData));

        if (prefix !== '') {
            prefix += '/';
        }

        // for object values
        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const value = data[key];

            if (is.object(value) && is.not.empty(value) && !areAllPropertiesObjets(value)) {
                array = buildProperties(array, value, prefix + key);
            }
        }

        return array;
    }

    function initLargeImageOpenseadragon(imageId, tiles, container) {
        openseadragon({
            element: container,
            prefixUrl: "libs/openseadragon/images/",
            crossOriginPolicy: "Anonymous",
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

    function initSimpleImageOpenseadragon(imageId, container) {
        openseadragon({
            element: container,
            prefixUrl: "libs/openseadragon/images/",
            maxZoomPixelRatio: 6,
            tileSources: {
                type: 'image',
                url: ajax.getImageUrl(imageId)
            }
        });
    }

    function areAllPropertiesObjets(obj) {
        const values = Object.values(obj);
        return values.every((item) => is.object(item));
    }

    return {
        showWindow
    };
});
