import { useState } from "react";

import LeftPanel from "../leftPanel/leftPanel"
import RightPanel from "../rightPanel/rightPanel"
import ZStackFrameContext from "../../../context/zStackFrameContext"

export default function Images() {
  const [zStackFrame, setZStackFrame] = useState(null);
  const zStackFrameValue = { zStackFrame, setZStackFrame }

  return (
    <div className="main-images">
      <ZStackFrameContext.Provider value = {zStackFrameValue}>
        <LeftPanel />
        <RightPanel />
      </ZStackFrameContext.Provider>
    </div>
  )
}
