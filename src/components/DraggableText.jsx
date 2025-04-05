import { useRef, useEffect } from 'react';

const DraggableText = ({ text, onUpdate, onSelect, selectedId }) => {
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - text.x,
      y: e.clientY - text.y,
    };
    onSelect(text.id);

    const handleMouseMove = (e) => {
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      onUpdate(text.id, { x: newX, y: newY });
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
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: text.x,
        top: text.y,
        fontSize: text.fontSize,
        color: text.color,
        fontWeight: 'bold',
        cursor: 'move',
        userSelect: 'none',
        zIndex: text.zIndex,
        textShadow: '2px 2px 4px #000000',
        border: text.id === selectedId ? '1px dashed #00f2ff' : 'none',
        padding: '2px 4px',
      }}
    >
      {text.content}
    </div>
  );
};

export default DraggableText;
