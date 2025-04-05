import { presetImages } from '../data/presetImages';

const ImageLibrary = ({ onSelect, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      background: '#1e1e1e',
      border: '1px solid #444',
      padding: '1em',
      zIndex: 200,
      maxWidth: 300,
      top: 100,
      left: 0,
    }}>
      <h4 style={{ color: 'white' }}>Image Library</h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        {presetImages.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            alt={img.name}
            title={img.name}
            style={{ width: 60, height: 60, cursor: 'pointer', border: '1px solid white' }}
            onClick={() => {
              onSelect(img.src);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageLibrary;
