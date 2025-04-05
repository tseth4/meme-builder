import { useRef, useEffect, useState } from 'react';

const DraggableText = ({ text, onUpdate, onSelect, selectedId }) => {
  const { id, content, x, y, width, height, zIndex } = text;

  const offset = useRef({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);


  const [draft, setDraft] = useState(content);
  const inputRef = useRef(null);
  // const resizing = useRef(false);

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
      // if resizing and the direction is set
      if (resizing && resizeDir) {
        // get deltas (current mouse pos - initial mouse pos)
        const dx = e.clientX - offset.current.x;
        const dy = e.clientY - offset.current.y;

        // initial top left corner of image
        let newX = x;
        let newY = y;
        // initial width and height
        let newW = width;
        let newH = height;

        // based on which direction we are either subtracting or adding
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

    // handle mouse click let go
    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      setResizeDir(null);
    };

    // listener calls handleMouseMove when mouse moves
    window.addEventListener('mousemove', handleMouseMove);
    // calls handleMouse up  which sets the dragging and resize state to False
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, resizeDir, x, y, width, height, id, onUpdate]);


  const handleDragStart = (e) => {
    // Prevent conflict with resizing
    e.stopPropagation();
    // set selected element
    onSelect(text.id)
    // if we are resizing break out
    if (resizing) return;

    setDragging(true);
    offset.current = {
      x: e.clientX - x,  // distance from top-left of image
      y: e.clientY - y,
    };
  };




  const handleResizeStart = (e, handleInfo) => {
    e.stopPropagation();
    // THESE TWO will trigger the useEffect
    // set resize state
    setResizing(true);
    // set resize direction to the handle x and y
    setResizeDir({ x: handleInfo.x, y: handleInfo.y });

    // set offset to the current mouse coords
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
    <>
      {editing ? (
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onUpdate(text.id, { content: draft });
          }}
          style={{
            fontSize: text.fontSize,
            color: text.color,
            fontWeight: 'bold',
            position: 'absolute',
            left: text.x,
            top: text.y,
            zIndex: text.zIndex,
            padding: '4px 6px',
            background: 'transparent',
            border: '2px solid black',
            textShadow: '2px 2px 4px #000000',
            outline: 'none',
            resize: 'both',
            minWidth: '100px',
            minHeight: '30px',
            width: text.width || 'auto',
            height: text.height || 'auto',
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            left: text.x,
            top: text.y,
            width: text.width,
            height: text.height,
            zIndex: text.zIndex,
          }}
        >
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={(e) => {
              console.log("double clicked")
              e.stopPropagation();
              setEditing(true);
              setDraft(content);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            style={{
              width: '100%',
              height: '100%',
              fontSize: text.fontSize,
              color: text.color,
              fontWeight: 'bold',
              cursor: 'move',
              userSelect: 'none',
              textShadow: '2px 2px 4px #000000',
              border: text.id === selectedId ? '1px dashed #00f2ff' : 'none',
              padding: '2px 4px',
              boxSizing: 'border-box',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
            }}
          >
            {content}
          </div>

          {selectedId === text.id && (

            handles.map((handle) => (
              <div
                key={handle.position}
                onMouseDown={(e) => handleResizeStart(e, handle)}
                style={{
                  // border: '5px solid pink',
                  background: 'rgba(0,0,0,0)', // transparent, or add hover if you want
                  ...getHandleStyle(handle.position),
                }}
              />
            ))


          )}
        </div>

      )}

    </>
  );
};

export default DraggableText;
