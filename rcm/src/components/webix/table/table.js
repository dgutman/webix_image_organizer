import * as webix from "webix";

export default class DataTable {
  constructor() {
    this._dataTableID = webix.uid();
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
          id: "a",
          /*
          sort:,
          editor:,
          fillspace: true,
          select: "row",
          */
          header: "Coord 1",
          select: "row",
          minWidth: 200,
        },
        {
          id: "b",
          header: "Coord 2",
          select: "row",
          minWidth: 200,
        },
        {
          id: "c",
          header: "Coord 3",
          select: "row",
          minWidth: 200,
        },
        {
          id: "d",
          header: "Coord 4",
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
    return webix.$$(this._dataTableID);
  }

  parseData(data) {
    /** @type {webix.ui.datatable} */
    const datatable = this.getDatatable();
    if (datatable) {
      datatable.parse(data);
      const firstItemID = datatable.getFirstId();
      datatable.select(firstItemID);
    }
    else {
      debugger;
    }
  }
}
