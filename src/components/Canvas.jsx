import DraggableImage from './DraggableImage';
import DraggableText from './DraggableText';
import { forwardRef, useRef, useState, useEffect } from 'react';
// import { useTransformable } from '../hooks/useTransformable';
import { resizeHandles, getHandleStyle } from '../utils/resizeHandles';

const Canvas = forwardRef(({ elements, onUpdate, onSelect, selectedId, canvasSize, setCanvasSize, isEditingCanvas }, ref) => {

  const offset = useRef({ x: 0, y: 0 });

  const startCanvasResize = (e, dir) => {
    e.stopPropagation();
    offset.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (e) => {
      const dx = e.clientX - offset.current.x;
      const dy = e.clientY - offset.current.y;

      setCanvasSize(prev => {
        let newX = prev.x || 0;
        let newY = prev.y || 0;
        let newW = prev.width;
        let newH = prev.height;

        if (dir.x === -1) {
          newX += dx;
          newW -= dx;
        } else if (dir.x === 1) {
          newW += dx;
        }

        if (dir.y === -1) {
          newY += dy;
          newH -= dy;
        } else if (dir.y === 1) {
          newH += dy;
        }

        return {
          x: newX,
          y: newY,
          width: Math.max(100, newW),
          height: Math.max(100, newH),
        };
      });

      offset.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };



  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: canvasSize.x || 0,
        top: canvasSize.y || 0,
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        background: '#f4f4f4',
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 0,
        marginBottom: 0,
        border: isEditingCanvas ? '1px dashed #00f2ff' : 'none',
        margin: '2rem',

      }}
      onMouseDown={() => onSelect(null)}
    >
      {elements.map((el) => {
        if (el.type === 'image') {
          return (
            <DraggableImage
              key={el.id}
              image={el}
              onUpdate={onUpdate}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          );
        } else if (el.type === 'text') {
          return (
            <DraggableText
              key={el.id}
              text={el}
              onUpdate={onUpdate}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          );
        } else {
          return null;
        }
      })}

      {isEditingCanvas &&
        resizeHandles.map((handle) => (
          <div
            key={handle.position}
            onMouseDown={(e) => startCanvasResize(e, handle)}
            style={{
              background: '#00f2ff',
              ...getHandleStyle(handle.position),
            }}
          />
        ))}
    </div>
  );
});

export default Canvas;
