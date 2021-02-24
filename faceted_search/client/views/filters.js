define([
    "app",
    "helpers/authentication",
], function (app, auth) {
    var value = "All";

    var getLabelUI = function (label) {
        return {
            view: "label",
            label: label.toUpperCase(),
            css: "main-label",
            align: "left"
        };
    };

    var getOptionsFromData = function (data) {
        var options = [value].concat(data.options);
        options.forEach(function (item, index, array) {
            var count = data.count[item] && data.count[item].length ? data.count[item].length : 0,
                result = {};

            result.id = item;
            result.value = item;
            if (count || item !== "All") {
                result.value += " (" + (count || 0) + ")";
            }


            array[index] = result;
        });
        return options;
    };

    var getRadioUI = function (data) {
        var options = getOptionsFromData(data);

        return {
            rows: [
                {
                    view: "label",
                    css: "checkbox-label",
                    label: data.name
                },
                {
                    id: data.id,
                    css: "radio-css",
                    view: "radio",
                    vertical: true,
                    height: options.length,
                    value: value,
                    options: options,
                    on: {
                        onChange: function (a) {
                            app.callEvent("filtersChanged", [{
                                "view": "radio",
                                "key": data.id,
                                "value": a,
                                "remove": true,
                                "status": "equals"
                            }]);
                        }
                    }
                }
            ]
        };
    };

    var getSliderUI = function (data) {
        var min = Math.min(...data.options) || 0,
            max = Math.max(...data.options) || 0,
            selectedValue = min - 1;

        return {
            rows: [
                {
                    view: "label",
                    css: "slider-label",
                    label: data.name
                },
                {
                    height: 60,
                    cols: [
                        {width: 40},
                        {
                            rows: [
                                {
                                    id: data.id,
                                    view: "slider",
                                    name: data.name,
                                    value: selectedValue,
                                    height: 40,
                                    min: min - 1,
                                    max: max,
                                    title: function (obj) {
                                        var value = obj.value;
                                        if (value === min - 1) {
                                            value = "All";
                                        }
                                        return value;
                                    },
                                    on: {
                                        onChange: function (a) {
                                            app.callEvent("filtersChanged", [{
                                                "view": "slider",
                                                "key": data.id,
                                                "value": a,
                                                "remove": true,
                                                "status": "less"
                                            }]);
                                        }
                                    }
                                },
                                {
                                    cols: [
                                        {
                                            view: 'template',
                                            template: min.toString(),
                                            type: 'clean',
                                            gravity: 1
                                        },
                                        {gravity: 1},
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
            rows: [
                {
                    view: "label",
                    css: "combo-label",
                    label: data.name
                },
                {
                    cols: [
                        {width: 40},
                        {
                            id: data.id,
                            view: "combo",
                            value: value,
                            options: options,
                            on: {
                                onChange: function (newValue) {
                                    app.callEvent("filtersChanged", [{
                                        "view": "combo",
                                        "key": data.id,
                                        "value": newValue,
                                        "remove": true,
                                        "status": "equals"
                                    }]);
                                }
                            }
                        }
                    ]
                }
            ]
        };
    };

    var getCheckboxUI = function (data) {
        var view = {
            rows: [
                {
                    view: "label",
                    css: "checkbox-label",
                    label: data.name
                },
                {
                    rows:[]
                }
            ]
        };

        data.options.forEach(function (option) {
            var value = 0,
                count = data.count[option] && data.count[option].length ? data.count[option].length : 0;

            view.rows[1].rows.push(
                {
                    id: data.id + "|" + option,
                    view: "checkbox",
                    css: "checkbox-filter",
                    labelRight: option + " (" + count + ")",
                    value: value,
                    on: {
                        onChange: function (status) {
                            app.callEvent("filtersChanged", [{
                                "view": "checkbox",
                                "key": data.id,
                                "value": option,
                                "remove": !status,
                                "status": "equals"
                            }]);

                        }
                    }
                }
            );
        });

        return view;

    };

    var getToggleUI = function (data) {
        var view = {
            rows: [
                {
                    view: "label",
                    css: "toggle-label",
                    label: data.name
                },
                {
                    rows: []
                }
            ]
        };

        data.options.forEach(function (option) {
            var value = 0,
                count = data.count[option] && data.count[option].length ? data.count[option].length : 0;
            view.rows[1].rows.push(
                {
                    cols: [
                        {
                            id: data.id + "|" + option,
                            view: "toggle",
                            css: "toggle-filter ellipsis-text",
                            tooltip: option + " (" + count + ")",
                            name: option,
                            type: 'icon',
                            offIcon: "mdi mdi-toggle-switch-off-outline",
                            onIcon: "mdi mdi-toggle-switch",
                            label: option + " (" + count + ")",
                            value: value,
                            on: {
                                onChange: function (status) {
                                    app.callEvent("filtersChanged", [{
                                        "view": "toggle",
                                        "key": data.id,
                                        "value": option,
                                        "remove": !status,
                                        "status": "equals"
                                    }]);
                                }
                            }
                        },
                        {width: 45}
                    ]
                }
            );
        });
        return view;
    };

    var getRangeSliderUI = function (data) {
        var min = Math.min(...data.options) || 0,
            max = Math.max(...data.options) || 0;

        var view = {
            rows: [
                {
                    view: "label",
                    css: "rangeslider-label",
                    label: data.name
                }
            ]
        }

        var controls = {
            height: 110,
            rows: [
                {
                    id: data.id + "|start",
                    view: "slider",
                    name: data.name,
                    label: "Start",
                    labelWidth: 100,
                    height: 40,
                    value: min,
                    min: min,
                    max: max,
                    title: "#value#",
                    on: {
                        onChange: function (a) {
                            app.callEvent("filtersChanged", [{
                                "view": "multiSlider",
                                "max": parseInt($$(data.id + "|end").getValue()),
                                "min": a,
                                "key": data.id,
                                "status": "between",
                                "remove": true
                            }]);
                        }
                    }
                },
                {
                    id: data.id + "|end",
                    view: "slider",
                    name: data.name,
                    label: "End",
                    labelWidth: 100,
                    height: 40,
                    value: max,
                    min: min,
                    max: max,
                    title: "#value#",
                    on: {
                        onChange: function (a) {
                            app.callEvent("filtersChanged", [{
                                "view": "multiSlider",
                                "key": data.id,
                                "max": a,
                                "min": $$(data.id + "|start").getValue(),
                                "status": "between",
                                "remove": true
                            }]);
                        }
                    }
                },
                {
                    cols: [
                        {width: 100},
                        {
                            view: 'template',
                            template: min.toString(),
                            type: 'clean',
                            maxWidth: 150,
                            gravity: 1
                        },
                        {},
                        {
                            view: 'template',
                            css: 'slider-label-right',
                            template: max.toString(),
                            type: 'clean',
                            maxWidth: 150,
                            gravity: 1
                        }
                    ]
                }
            ]
        }

        view.rows[1] = controls;
        return view;
    };


    var getOptions = function (data) {
        return getOptionsFromData(data)
    };

    var getToggleOptions = function (data) {
        var tmp = [];
        data.options.forEach(function (option) {
            var count = data.count[option] && data.count[option].length ? data.count[option].length : 0;
            tmp.push({id: data.id + "|" + option, label: option + " (" + count + ")"})
        });
        return tmp;
    };

    var getCheckboxOptions = function (data) {
        var tmp = [];
        data.options.forEach(function (option) {
            var count = data.count[option] && data.count[option].length ? data.count[option].length : 0;
            tmp.push({id: data.id + "|" + option, labelRight: option + " (" + count + ")"})
        });
        return tmp;
    };

    return {
        getLabelUI: getLabelUI,
        getRadioUI: getRadioUI,
        getSliderUI: getSliderUI,
        getComboUI: getComboUI,
        getCheckboxUI: getCheckboxUI,
        getToggleUI: getToggleUI,
        getRangeSliderUI: getRangeSliderUI,
        getOptions: getOptions,
        getCheckboxOptions: getCheckboxOptions,
        getToggleOptions: getToggleOptions
    }
});