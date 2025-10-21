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
      editable: true,
      resizeColumn: false,
      fixedRowHeight: false,
      tooltip: true,
      columns: [
        {
          id: "yamlId",
          header: "Yaml Id",
          select: "row",
          width: 200,
        },
        {
          id: "description",
          header: "Description",
          select: "row",
          width: 150,
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
          id: "x_min",
          header: "x_min",
          select: "row",
          width: 100,
          editor: "text",
          editable: true,
        },
        {
          id: "x_max",
          header: "x_max",
          select: "row",
          width: 100,
          editor: "text",
          editable: true,
        },
        {
          id: "y_min",
          header: "y_min",
          select: "row",
          width: 100,
          editor: "text",
          editable: true,
        },
        {
          id: "y_max",
          header: "y_max",
          select: "row",
          width: 100,
          editor: "text",
          editable: true,
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

  destructor() { }

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
    }
  }

  attachCoordinateEvents(imageTemplate) {
    const datatable = this.getDatatable();
    if (datatable) {
      // Handle coordinate changes in the table
      datatable.attachEvent("onAfterEditStop", (id, column, value) => {
        if (['x_max', 'x_min', 'y_max', 'y_min'].includes(column)) {
          console.log(`Table: Coordinate changed - ${column}: ${value} for row ${id}`);
          this.updateROIFromTable(id, column, value, imageTemplate);
        }
      });
    }
  }

  updateROIFromTable(rowId, column, value, imageTemplate) {
    // Get all table data to draw all ROIs
    const datatable = this.getDatatable();
    const allData = datatable.serialize();

    if (allData && imageTemplate) {
      console.log('Table: Updating all ROIs from table data');

      // Clear existing ROIs first
      if (imageTemplate.openSeaDragonViewer) {
        imageTemplate.openSeaDragonViewer.clearOverlays();
      }

      // Draw all ROIs from all rows
      this.drawAllROIsFromTable(allData, imageTemplate);
    }
  }

  drawAllROIsFromTable(allData, imageTemplate) {
    console.log('Table: Drawing all ROIs from', allData.length, 'rows');

    allData.forEach((rowData, index) => {
      // Only draw ROIs that have valid coordinates
      if (rowData.x_min && rowData.x_max && rowData.y_min && rowData.y_max) {
        const roiCoordinates = {
          x: parseFloat(rowData.x_min) || 0,
          y: parseFloat(rowData.y_min) || 0,
          width: (parseFloat(rowData.x_max) || 0) - (parseFloat(rowData.x_min) || 0),
          height: (parseFloat(rowData.y_max) || 0) - (parseFloat(rowData.y_min) || 0)
        };

        console.log(`Table: Drawing ROI ${index + 1} with coordinates:`, roiCoordinates);

        // Draw this ROI on the viewer
        this.drawSingleROI(roiCoordinates, index, imageTemplate);
      }
    });
  }

  drawSingleROI(roiCoordinates, index, imageTemplate) {
    if (imageTemplate && imageTemplate.openSeaDragonViewer) {
      // Create overlay element for this ROI
      const overlayElement = document.createElement("div");
      overlayElement.className = "overlay-rect";
      overlayElement.style.borderColor = this.getROIColor(index);
      overlayElement.style.borderStyle = "solid";
      overlayElement.style.borderWidth = "2px";
      overlayElement.style.visibility = "visible";
      overlayElement.style.position = "absolute";
      overlayElement.style.left = roiCoordinates.x + "px";
      overlayElement.style.top = roiCoordinates.y + "px";
      overlayElement.style.width = roiCoordinates.width + "px";
      overlayElement.style.height = roiCoordinates.height + "px";

      // Add to the viewer
      const viewer = imageTemplate.openSeaDragonViewer.$viewer();
      if (viewer) {
        // Convert pixel coordinates to viewport coordinates
        const viewportRect = new OpenSeadragon.Rect(
          roiCoordinates.x,
          roiCoordinates.y,
          roiCoordinates.width,
          roiCoordinates.height
        );

        imageTemplate.openSeaDragonViewer.addOverlay(overlayElement, viewportRect);
        console.log(`Table: Added ROI ${index + 1} to viewer`);
      }
    }
  }

  getROIColor(index) {
    // Different colors for different ROIs
    const colors = ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[index % colors.length];
  }
}
