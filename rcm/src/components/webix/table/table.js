import { uid, $$ } from "webix";

export default class DataTable {
  constructor() {
    this._dataTableID = uid();
  }

  /**
   * 
   * @returns {webix.ui.datatableConfig}
   */
  getUI() {
    return {
      view: "datatable",
      css: "main-datatable",
      id: this._dataTableID,
      select: true,
      editable: false,
      resizeColumn: false,
      fixedRowHeight: false,
      spans: true,
      tooltip: true,
      columns: [
        {
          id: "yamlId",
          header: "Yaml Id",
          select: "row",
          fillspace: true,
        },
        {
          id: "description",
          header: "Description",
          select: "row",
          fillspace: true,
        },
        {
          id: "Unnamed: 0",
          header: "Idx",
          select: "row",
        },
        {
          id: "type",
          header: "Image type",
          select: "row",
        },
        {
          id: "x_max",
          /*
          sort:,
          editor:,
          fillspace: true,
          select: "row",
          */
          header: "x_max",
          select: "row",
          minWidth: 200,
        },
        {
          id: "x_min",
          header: "x_min",
          select: "row",
          minWidth: 200,
        },
        {
          id: "y_max",
          header: "y_max",
          select: "row",
          minWidth: 200,
        },
        {
          id: "y_min",
          header: "y_min",
          select: "row",
          minWidth: 200,
        },
        {
          id: "fov_mm_x",
          header: "Fov x, mm",
          select: "row",
        },
        {
          id: "fov_mm_y",
          header: "fov_Y",
          select: "row",
        },
        {
          id: "z_um_bottom",
          header: "Z_um_bottom",
          select: "row",
        },
        {
          id: "z_um_top",
          header: "Z_um_top",
          select: "row",
        },
        {
          id: "slices",
          header: "Slices",
          select: "row",
        },
      ]
    }
  }

  destructor() {}

   /** @returns {webix.ui.datatable}*/
  getDatatable() {
    return $$(this._dataTableID);
  }

  parseData(data) {
    /** @type {webix.ui.datatable} */
    const datatable = this.getDatatable();
    if (datatable) {
      datatable.clearAll();
      datatable.parse(data);
      const firstItemID = datatable.getFirstId();
      datatable.select(firstItemID);
    }
  }
}
