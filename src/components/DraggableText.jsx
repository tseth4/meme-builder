import { useRef, useEffect, useState } from 'react';

const DraggableText = ({ text, onUpdate, onSelect, selectedId }) => {
  const offset = useRef({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text.content);
  const inputRef = useRef(null);


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
    <>
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onUpdate(text.id, { content: draft });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditing(false);
              onUpdate(text.id, { content: draft });
            }
          }}
          style={{
            fontSize: text.fontSize,
            color: text.color,
            fontWeight: 'bold',
            position: 'absolute',
            left: text.x,
            top: text.y,
            zIndex: text.zIndex,
            padding: '2px 4px',
            background: 'transparent',
            border: '1px solid #00f2ff',
            outline: 'none',
            textShadow: '2px 2px 4px #000',
          }}
        />
      ) : (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
            setDraft(text.content);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
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
        </div >
      )}

    </>
  );
};

export default DraggableText;
