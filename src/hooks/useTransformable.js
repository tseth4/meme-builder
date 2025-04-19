import { useRef, useEffect, useState } from 'react';

export function useTransformable({ id, initial, onUpdate, onSelect }) {
  const offset = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizing && resizeDir) {
        const dx = e.clientX - offset.current.x;
        const dy = e.clientY - offset.current.y;

        let newX = initial.x;
        let newY = initial.y;
        let newW = initial.width;
        let newH = initial.height;

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
  }, [dragging, resizing, resizeDir, id, initial, onUpdate]);

  const startDrag = (e) => {
    e.stopPropagation();
    // setting selected id
    onSelect(id);
    // if were resizing breakout
    if (resizing) return;
    // set dragging to true
    setDragging(true);
    // Set the initial offset: the distance between the mouse position and the element’s top-left corner
    // Example: image at (100, 100), mouse clicks at (150, 120) => offset = (50, 20)
    // As the mouse moves, we subtract this offset from the current mouse position
    // to calculate the new top-left position of the element — keeping the grab point consistent
    offset.current = {
      x: e.clientX - initial.x,
      y: e.clientY - initial.y,
    };
  };

  const startResize = (e, dir) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDir({ x: dir.x, y: dir.y });
    offset.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  return {
    dragging,
    resizing,
    resizeDir,
    startDrag,
    startResize,
  };
}
