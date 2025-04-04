import DraggableImage from './DraggableImage';
import { forwardRef } from 'react';

const Canvas = forwardRef(({ images, onUpdate, changeZIndex, onSelect }, ref) => {
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
      {images.map(img => (
        <DraggableImage
          key={img.id}
          image={img}
          onUpdate={onUpdate}
          changeZIndex={changeZIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});

export default Canvas;
