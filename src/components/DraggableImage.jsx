import { useState, useRef } from 'react';
import { resizeHandles, getHandleStyle } from '../utils/resizeHandles';
import { useTransformable } from '../hooks/useTransformable';

const DraggableImage = ({ image, onUpdate, changeZIndex, onSelect }) => {
  const { id, src, x, y, width, height, zIndex } = image;
  // const [resizing, setResizing] = useState(false);
  // const [dragging, setDragging] = useState(false);
  // const [resizeDir, setResizeDir] = useState(null);

  const offset = useRef({ x: 0, y: 0 });


  const {
    startDrag,
    startResize,
    dragging
  } = useTransformable({
    id,
    initial: { x, y, width, height },
    onUpdate,
    onSelect,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        zIndex,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        // border: '5px solid blue',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      // sets the initial offset
      onMouseDown={startDrag}
    >
      {resizeHandles.map((handle) => (
        <div
          key={handle.position}
          onMouseDown={(e) => startResize(e, handle)}
          style={{
            // border: '5px solid pink',
            background: 'rgba(0,0,0,0)', // transparent, or add hover if you want
            ...getHandleStyle(handle.position),
          }}
        />
      ))}
      {/* <button onClick={() => changeZIndex(id, 'up')}>Bring Forward</button>
      <button onClick={() => changeZIndex(id, 'down')}>Send Backward</button> */}

    </div>
  );
};

export default DraggableImage;
