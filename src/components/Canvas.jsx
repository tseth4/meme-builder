import DraggableImage from './DraggableImage';
import DraggableText from './DraggableText';
import { forwardRef } from 'react';

const Canvas = forwardRef(({ elements, onUpdate, changeZIndex, onSelect, selectedId }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#f4f4f4',
        overflow: 'hidden',
      }}
      onMouseDown={() => onSelect(null)}
    >
      {elements.map(el => {
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
        }
      })}

    </div>
  );
});

export default Canvas;
