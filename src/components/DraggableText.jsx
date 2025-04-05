import { useRef, useEffect, useState } from 'react';

const DraggableText = ({ text, onUpdate, onSelect, selectedId }) => {
  const offset = useRef({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text.content);
  const inputRef = useRef(null);
  const resizing = useRef(false);

  const handleResizeStart = (e, corner) => {
    e.stopPropagation();
    resizing.current = true;
    offset.current = {
      x: e.clientX,
      y: e.clientY,
    };

    const handleMouseMove = (e) => {
      if (!resizing.current) return;

      const dx = e.clientX - offset.current.x;
      const dy = e.clientY - offset.current.y;

      onUpdate(text.id, {
        width: Math.max(50, text.width + dx),
        height: Math.max(30, text.height + dy),
      });

      offset.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseUp = () => {
      resizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(text.id);

    offset.current = {
      x: e.clientX - text.x,
      y: e.clientY - text.y,
    };

    const handleMouseMove = (e) => {
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;

      onUpdate(text.id, {
        x: newX,
        y: newY,
      });
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
            onMouseDown={handleMouseDown}
            onDoubleClick={(e) => {
              console.log("double clicked")
              e.stopPropagation();
              setEditing(true);
              setDraft(text.content);
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
            {text.content}
          </div>

          {selectedId === text.id && (
            <div
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                background: '#00f2ff',
                cursor: 'nwse-resize',
              }}
            />
          )}
        </div>

      )}

    </>
  );
};

export default DraggableText;
