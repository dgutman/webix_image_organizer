import React, { useEffect, useState, useRef } from 'react';

import * as webix from 'webix';
import 'webix/webix.css';

export default function Webix({componentUI, componentData, componentSelect}) {
  const [data, setData] = useState(componentData);
  const [select, setSelect] = useState(componentSelect);
  const [ui, setUI] = useState(componentUI)
  const root = useRef("root");

  useEffect(() => {
    let webixUI
    if (ui) {
       webixUI = webix.ui(
        ui,
        root.current
      );
    }

    return () => {
      if (webixUI.destructor) {
        webixUI.destructor();
      }
      setUI(null);
    }
  }, [])

  useEffect(() => {
    if (data) {
      setData(data);

      if (ui.setValues)
        ui.setValues(data);
      else if (ui.parse)
        ui.parse(data)
      else if (ui.setValue)
        ui.setValue(data); 
      setData(data);
    }
    if (select) {
      setSelect(select);
      select();
    }
  }, [data, select])

  return <div className="webix-component" ref={root}></div>
}
