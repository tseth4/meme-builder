// import './LayerPanel.css';
import { LayerPanel, LayerItem, LayerPreview, LayerActions } from './LayerPanel.styles';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';


const Layers = ({ images, selectedId, onSelect, onMove, onDelete }) => {
  const sorted = [...images].sort((a, b) => b.zIndex - a.zIndex); // Top to bottom

  return (
    <LayerPanel>
      <h4>Layers</h4>
      {sorted.map((img) => (
        <LayerItem
          key={img.id}
          active={img.id === selectedId}
          onClick={() => onSelect(img.id)}
        >
          <LayerPreview style={{ backgroundImage: `url(${img.src})` }} />
          <span>Layer {img.zIndex}</span>
          <LayerActions>
            <button onClick={(e) => { e.stopPropagation(); onMove(img.id, 'up'); }}>
              <ArrowUp size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMove(img.id, 'down'); }}>
              <ArrowDown size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}>
              <Trash2 size={16} />
            </button>
          </LayerActions>

        </LayerItem>
      ))}
    </LayerPanel>
  );
};

export default Layers;