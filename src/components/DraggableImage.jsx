import { useState, useRef, useEffect } from 'react';

const DraggableImage = ({ image, onUpdate, changeZIndex }) => {
  const { id, src, x, y, width, height, zIndex } = image;
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [resizeDir, setResizeDir] = useState(null);

  const offset = useRef({ x: 0, y: 0 });



  const handles = [
    { position: 'top-left', x: -1, y: -1, cursor: 'nwse-resize' },
    { position: 'top', x: 0, y: -1, cursor: 'ns-resize' },
    { position: 'top-right', x: 1, y: -1, cursor: 'nesw-resize' },
    { position: 'right', x: 1, y: 0, cursor: 'ew-resize' },
    { position: 'bottom-right', x: 1, y: 1, cursor: 'nwse-resize' },
    { position: 'bottom', x: 0, y: 1, cursor: 'ns-resize' },
    { position: 'bottom-left', x: -1, y: 1, cursor: 'nesw-resize' },
    { position: 'left', x: -1, y: 0, cursor: 'ew-resize' },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizing && resizeDir) {
        const dx = e.clientX - offset.current.x;
        const dy = e.clientY - offset.current.y;

        let newX = x;
        let newY = y;
        let newW = width;
        let newH = height;

        if (resizeDir.x === -1) {
          newX += dx;
          newW -= dx;
        } else if (resizeDir.x === 1) {
          newW += dx;
        }

        if (resizeDir.y === -1) {
          newY += dy;
          newH -= dy;
        } else if (resizeDir.y === 1) {
          newH += dy;
        }

        onUpdate(id, { x: newX, y: newY, width: newW, height: newH });

        offset.current = { x: e.clientX, y: e.clientY };
      }

      if (dragging) {
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        onUpdate(id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      setResizeDir(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, resizeDir, x, y, width, height, id, onUpdate]);


  const handleDragStart = (e) => {
    // Prevent conflict with resizing
    if (resizing) return;

    setDragging(true);
    offset.current = {
      x: e.clientX - x,  // distance from top-left of image
      y: e.clientY - y,
    };
  };

  const handleResizeStart = (e, handleInfo) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDir({ x: handleInfo.x, y: handleInfo.y });
    offset.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const getHandleStyle = (position) => {
    const base = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          top: -5,
          left: 0,
          width: '100%',
          height: 10,
          cursor: 'ns-resize',
        };
      case 'bottom':
        return {
          ...base,
          bottom: -5,
          left: 0,
          width: '100%',
          height: 10,
          cursor: 'ns-resize',
        };
      case 'left':
        return {
          ...base,
          left: -5,
          top: 0,
          width: 10,
          height: '100%',
          cursor: 'ew-resize',
        };
      case 'right':
        return {
          ...base,
          right: -5,
          top: 0,
          width: 10,
          height: '100%',
          cursor: 'ew-resize',
        };
      case 'top-left':
        return {
          ...base,
          top: -5,
          left: -5,
          width: 10,
          height: 10,
          cursor: 'nwse-resize',
        };
      case 'top-right':
        return {
          ...base,
          top: -5,
          right: -5,
          width: 10,
          height: 10,
          cursor: 'nesw-resize',
        };
      case 'bottom-left':
        return {
          ...base,
          bottom: -5,
          left: -5,
          width: 10,
          height: 10,
          cursor: 'nesw-resize',
        };
      case 'bottom-right':
        return {
          ...base,
          bottom: -5,
          right: -5,
          width: 10,
          height: 10,
          cursor: 'nwse-resize',
        };
      default:
        return {};
    }
  };


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
        border: '1px solid #ccc',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      // sets the initial offset
      onMouseDown={handleDragStart}
    >
      {handles.map((h) => (
        <div
          key={h.position}
          onMouseDown={(e) => handleResizeStart(e, h)}
          style={{
            background: 'rgba(0,0,0,0)', // transparent, or add hover if you want
            ...getHandleStyle(h.position),
          }}
        />
      ))}
      <button onClick={() => changeZIndex(id, 'up')}>Bring Forward</button>
      <button onClick={() => changeZIndex(id, 'down')}>Send Backward</button>

    </div>
  );
};

export default DraggableImage;
