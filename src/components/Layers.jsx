// import './LayerPanel.css';
import { LayerPanel, LayerItem, LayerPreview, LayerActions } from './LayerPanel.styles';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';


const Layers = ({ elements, selectedId, onSelect, onMove, onDelete }) => {
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex); // Top to bottom

  return (
    <LayerPanel>
      <h4>Layers</h4>
      {sorted.map((el) => (
        <LayerItem
          key={el.id}
          active={el.id === selectedId}
          onClick={() => onSelect(el.id)}
        >
          {/* <span>{img.zIndex}</span> */}
          {el.type == 'image' ?
            <>
              <LayerPreview style={{ backgroundImage: `url(${el.src})` }} />
              <span>{el.src.split('/').pop().slice(-10)}</span>
            </>

            :
            <>
              <LayerPreview>
                <span style={{ padding: '0.6em', fontSize: '1.2em', fontWeight: 'bold' }}>T</span>
              </LayerPreview>
              <span>{el.content.split('/').pop().slice(0, 10)}</span>

            </>
          }

          <LayerActions>
            <button onClick={(e) => { e.stopPropagation(); onMove(el.id, 'up'); }}>
              <ArrowUp size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMove(el.id, 'down'); }}>
              <ArrowDown size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}>
              <Trash2 size={16} />
            </button>
          </LayerActions>

        </LayerItem>
      ))}
    </LayerPanel>
  );
};

export default Layers;