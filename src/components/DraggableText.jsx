import { useRef, useState } from 'react';
import { resizeHandles, getHandleStyle } from '../utils/resizeHandles';
import { useTransformable } from '../hooks/useTransformable';

const DraggableText = ({ text, onUpdate, onSelect, selectedId }) => {
  const { id, content, x, y, width, height, zIndex } = text;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const inputRef = useRef(null);

  const {
    startDrag,
    startResize,
  } = useTransformable({
    id,
    initial: { x, y, width, height },
    onUpdate,
    onSelect,
  });


  return (
    <div >
      {editing ? (
        <textarea
          hello="world"
          data-exportable="true"
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onUpdate(text.id, { content: draft });
          }}
          onMouseDown={(e) => e.stopPropagation()}

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
            // border: '2px solid black',
            border: '2px solid purple',
            // textShadow: '2px 2px 4px #000000',
            outline: 'none',
            resize: 'none',
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
          data-exportable="true"
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
            onMouseDown={startDrag}
            onDoubleClick={(e) => {
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
              // textShadow: '2px 2px 4px #000000',
              border: text.id === selectedId ? '1px dashed #00f2ff' : 'none',
              fontFamily: text.fontFamily || 'Arial',
              padding: '2px 4px',
              boxSizing: 'border-box',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
            }}
          >
            {content}
          </div>

          {selectedId === text.id && (

            resizeHandles.map((handle) => (
              <div
                key={handle.position}
                onMouseDown={(e) => startResize(e, handle)}
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

    </div>
  );
};

export default DraggableText;
