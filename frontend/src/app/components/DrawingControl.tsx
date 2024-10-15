import React, { useRef, useEffect, useState } from "react";
import Image from 'next/image';

import CursorTool from '../icons/CursorTool';
import PenTool from '../icons/pen-tool.svg';
import EraserTool from '../icons/eraser-tool.svg';
import MarkerTool from '../icons/marker-tool.svg';
import PathTool from '../icons/path-tool.svg';
import AreaTool from '../icons/AreaTool';

interface DrawingControlProps {
  onClickCursorTool: () => void
  onClickAreaTool: () => void
}

function DrawingControl(props: DrawingControlProps) {
  return (
    <div style={{
      display: 'flex',
      width: 300,
      justifyContent: 'space-between'
    }}>
      <button onClick={props.onClickCursorTool}>
        <CursorTool color="black" />
      </button>
      <Image priority src={PenTool} alt="Pen Tool" />
      <Image priority src={EraserTool} alt="Eraser Tool" />
      <Image priority src={MarkerTool} alt="Marker Tool" />
      <Image priority src={PathTool} alt="Path Tool" />
      <button onClick={props.onClickAreaTool}>
        <AreaTool color="black" />
      </button>
    </div>
  )
}

export default DrawingControl