import { useState, useRef, useEffect } from 'react';

const DraggableImage = ({ image, onUpdate }) => {
  const { id, src, x, y, width, height } = image;
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // handleResizeDown
      if (resizing) {
        // delta is the actual change in x
        const deltaX = e.clientX - offset.current.x;
        const deltaY = e.clientY - offset.current.y;

        onUpdate(id, {
          width: width + deltaX,
          height: height + deltaY,
        });

        offset.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      if (dragging) {
        onUpdate(id, {
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setResizing(false);
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, dragging, width, height, id, onUpdate]);

  const handleResizeDown = (e) => {
    e.stopPropagation();

    setResizing(true);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
    };

  };

  const handleMouseDown = (e) => {
    console.log("mousedown")
    setDragging(true);
    offset.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        border: '1px solid #ccc',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      // sets the initial offset
      onMouseDown={handleMouseDown}
    >
      <div
        onMouseDown={handleResizeDown}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 15,
          height: 15,
          background: 'red',
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

export default DraggableImage;
