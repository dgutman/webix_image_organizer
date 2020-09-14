define([
    "libs/is/is.min",
    "templates/image",
], function (is, imageTemplate) {

    var windowWidthRatio = 0.7;
    var windowWidthAdditionalRatio = 0.8;
    var imageWidthRation = 0.4;
    var windowHeightRatio = 0.28;
    var propertyListWidthRatio = 0.42;

    var showWindow = function (data) {
        var id = webix.uid();
        webix.ui({
            view: "window",
            id: id,
            position: "center",
            width: window.innerWidth * windowWidthRatio * windowWidthAdditionalRatio,
            height: window.innerWidth * windowHeightRatio,
            move: true,
            scroll: 'x',
            head: {
                view: "toolbar", cols: [
                    {view: "label", label: data.data.name},
                    {
                        view: "button", label: "Close", width: 100, align: "right",
                        click: function () {
                            $$(this).close();
                        }.bind(id)
                    }
                ]
            },
            body: {
                view: 'scrollview',
                scroll: 'x',
                body:{
                    cols: [
                        {
                            rows: [
                                {
                                    view: "template",
                                    css: 'popup-img',
                                    width: window.innerWidth * windowWidthRatio * imageWidthRation,
                                    template: () => imageTemplate.getTemplate(data)
                                }
                            ]
                        },
                        getPropertyList(data.data)
                    ]
                }
            }
        }).show();
    };

    var getPropertyList = function (data) {
        return {
            view: "property",
            editable: false,
            scroll: true,
            nameWidth: 180,
            width: window.innerWidth * propertyListWidthRatio,
            elements: buildProperties([], data, '')
        };
    };

    var buildProperties = function (array, data, prefix) {
        var key, i;
        if (prefix === '') {
            array.push({label: "Main", type: "label"});
        } else {
            array.push({label: prefix, type: "label"});
        }

        if (prefix !== '') {
            prefix += '/';
        }

        var keys = Object.keys(data);
        var length = keys.length;

        // for string values
        for (i = 0; i < length; i++) {
            key = keys[i];

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
        for (i = 0; i < length; i++) {
            key = keys[i];

            if (is.object(data[key])) {
                array = buildProperties(array, data[key], prefix + key);
            }
        }

        return array;
    };

    return {
        showWindow: showWindow
    }
});