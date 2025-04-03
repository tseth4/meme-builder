import DraggableImage from './DraggableImage';

const Canvas = ({ images, onUpdate }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#f4f4f4',
        overflow: 'hidden',
        border: '1px solid red'
      }}
    >
      {images.map(img => (
        <DraggableImage key={img.id} image={img} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default Canvas;
