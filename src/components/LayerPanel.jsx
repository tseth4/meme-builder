import './LayerPanel.css';

const LayerPanel = ({ images, selectedId, onSelect, onMove, onDelete }) => {
  const sorted = [...images].sort((a, b) => b.zIndex - a.zIndex); // Top to bottom

  return (
    <div className="layer-panel">
      <h4>Layers</h4>
      {sorted.map((img) => (
        <div
          key={img.id}
          className={`layer-item ${img.id === selectedId ? 'active' : ''}`}
          onClick={() => onSelect(img.id)}
        >
          <div className="layer-preview" style={{ backgroundImage: `url(${img.src})` }} />
          <span>Layer {img.zIndex}</span>
          <div className="layer-actions">
            <button onClick={(e) => { e.stopPropagation(); onMove(img.id, 'up'); }}>⬆️</button>
            <button onClick={(e) => { e.stopPropagation(); onMove(img.id, 'down'); }}>⬇️</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerPanel;