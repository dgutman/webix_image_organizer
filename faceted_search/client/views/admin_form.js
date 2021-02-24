define([], function () {

    var getOptionsFromData = function (data) {
        var i, array = [], tmp = webix.uid();
        for(i = 0; i < (data.interface.length > 4 ? 4 : data.interface.length); i++) {
            array.push({
                id: tmp + data.interface[i] + tmp,
                value: data.interface[i]
            });
        }
        return array;
    };

    var getRadioUI = function (data) {
        var options = getOptionsFromData(data);

        return {
            css: "radio-css label-css",
            view: "radio",
            vertical: true,
            height: 4 * 38,
            label: data.facet.value,
            labelPosition: 'top',
            options: options
        };
    };

    var getSliderUI = function (data) {
        var min = Math.min(...data.interface) || 0,
            max = Math.max(...data.interface) || 0,
            selectedValue = min - 1;

        return {
            id: webix.uid(),
            rows: [
                {
                    view: "label",
                    css: "slider-label",
                    label: data.facet.value
                },
                {
                    cols: [
                        {width: 40},
                        {
                            rows: [
                                {
                                    view: "slider",
                                    value: selectedValue,
                                    height: 40,
                                    min: min - 1,
                                    max: max
                                },
                                {
                                    height: 40,
                                    cols: [
                                        {
                                            view: 'template',
                                            template: min.toString(),
                                            type: 'clean',
                                            gravity: 1
                                        },
                                        {gravity: 4},
                                        {
                                            view: 'template',
                                            css: 'slider-num-right',
                                            template: max.toString(),
                                            type: 'clean',
                                            gravity: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    };

    var getComboUI = function (data) {
        var options = getOptionsFromData(data);
        return {
            id: webix.uid(),
            rows: [
                {
                    view: "label",
                    css: "combo-label",
                    label: data.facet.value
                },
                {
                    cols: [
                        {width: 40},
                        {
                            view: "combo",
                            options: options
                        }
                    ]
                }
            ]
        };
    };

    var getCheckboxUI = function (data) {
        var i, tmp = webix.uid(), view = {
            id: webix.uid(),
            rows: [
                {
                    view: "label",
                    css: "checkbox-label",
                    label: data.facet.value
                }
            ]
        };
        for(i = 0; i < (data.interface.length > 4 ? 4 : data.interface.length); i++) {
            view.rows.push(
                {
                    id: tmp + data.interface[i] + tmp ,
                    view: "checkbox",
                    css: "checkbox-filter",
                    labelRight: data.interface[i],
                    value: data.interface[i]
                }
            );
        }

        return view;

    };

    var getToggleUI = function (data) {
        var i, tmp = webix.uid(), view = {
            id: webix.uid(),
            rows: [
                {
                    view: "label",
                    css: "toggle-label",
                    label: data.facet.value
                }
            ]
        };

        for(i = 0; i < (data.interface.length > 4 ? 4 : data.interface.length); i++) {
            view.rows.push(
                {
                    id: tmp + data.interface[i] + tmp,
                    view: "toggle",
                    css: "toggle-filter",
                    name: data.interface[i],
                    type: 'icon',
                    offIcon: "mdi mdi-toggle-switch-off-outline",
                    onIcon: "mdi mdi-toggle-switch",
                    label: data.interface[i],
                    value: data.interface[i]
                }
            );
        }

        return view;
    };

    var getRangeSliderUI = function (data) {
        var min = data.interface[0],
            max = data.interface[0],
            i;

        for (i = 0; i < data.interface.length; i++) {
            if (data.interface[i] < min) {
                min = data.interface[i];
            }
            if (data.interface[i] > max) {
                max = data.interface[i];
            }
        }

        return {
            id: webix.uid(),
            rows: [
                {
                    view: "label",
                    css: "rangeslider-label",
                    label: data.facet.value
                },
                {
                    view: "slider",
                    label: "Start",
                    labelWidth: 100,
                    height: 40,
                    value: min,
                    min: min,
                    max: max,
                    title: "#value#"
                },
                {
                    view: "slider",
                    label: "End",
                    labelWidth: 100,
                    height: 40,
                    value: max,
                    min: min,
                    max: max,
                    title: "#value#"
                },
                {
                    height: 50,
                    cols: [
                        {width: 100},
                        {
                            view: 'template',
                            template: min.toString(),
                            type: 'clean',
                            gravity: 1
                        },
                        {gravity: 3},
                        {
                            view: 'template',
                            css: 'slider-label-right',
                            template: max.toString(),
                            type: 'clean',
                            gravity: 1
                        }
                    ]
                },
                {}
            ]
        };
    };


    return {
        getRadioUI: getRadioUI,
        getSliderUI: getSliderUI,
        getComboUI: getComboUI,
        getCheckboxUI: getCheckboxUI,
        getToggleUI: getToggleUI,
        getRangeSliderUI: getRangeSliderUI
    }
});