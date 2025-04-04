import DraggableImage from './DraggableImage';

const Canvas = ({ images, onUpdate, changeZIndex, onSelect }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#f4f4f4',
        overflow: 'hidden',
      }}
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
};

export default Canvas;
