define([
  "app",
  "helpers/base_jet_view",
  "libs/is/is.min"
], function(
  app,
  BaseJetView,
  is
) {
  "use strict";
  const ACCORDION_VIEW_ID = `#property_accordion_view_${webix.uid()}`;

  return class PropertyAccordion extends BaseJetView {
    constructor(app, options = {}) {
      super(app);

      this._options = options;
      this._scrollviewOptions = options.scrollviewOptions || {};
    }

    get $ui() {
      return {
        ...this._scrollviewOptions,
        view: 'scrollview',
        id: this._rootId,
        body: {
          view: "accordion",
          localId: ACCORDION_VIEW_ID,
          multi: true,
          collapsed: true,
          margin: 0,
          rows: []
        }
      };
    }

    get $accordion() {
      return this.$$(ACCORDION_VIEW_ID);
    }

    setProperties(properties) {
      const views = this.buildProperties([], properties, '');
      this.app.ui(views, this.$accordion);
    }

    getPropertyAccordionItem(prefix, data) {
      return {
        view: "accordionitem",
        header: (prefix === '') ? "Main" : prefix,
        collapsed: true,
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

    buildProperties(array, data, prefix) {
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

      if (arrayData.length !== 0) {
        array.push(this.getPropertyAccordionItem(prefix, arrayData));
      }

      if (prefix !== '') {
        prefix += '/';
      }

      // for object values
      for (let i = 0; i < length; i++) {
        const key = keys[i];
        const value = data[key];

        if (is.object(value) && is.not.empty(value)) {
          array = this.buildProperties(array, value, prefix + key);
        }
      }

      return array;
    }
  };
});
