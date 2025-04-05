import { useState } from 'react';
import Canvas from './components/Canvas';
import sampleImg from './sample.png';
import Layers from './components/Layers';
import ImageUploader from './components/ImageUploader';
import { reorderLayer } from './utils/reorderLayer';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import ColorPicker from './components/ColorPicker';
import ImageLibrary from './components/ImageLibrary';

import styled from '@emotion/styled'

const AppContainer = styled.div`
  background: #333;
  color: #fff;
  width: 100vw;
  display: flex;
  position: relative;
  overflow: hidden;
`;
const AddImageButton = styled.button`
  color: white;
  height: auto;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
`;

function App() {
  const canvasRef = useRef(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [elements, setElements] = useState([
    {
      id: 1,
      type: 'image',
      src: sampleImg,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      zIndex: 1,
    },
    {
      id: 2,
      type: 'text',
      content: 'Top Text',
      fontSize: 32,
      color: '#000000',
      x: 150,
      y: 50,
      zIndex: 2,
      width: 200,
      height: 100,
    }
  ]);

  const updateElement = (id, updates) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const addImage = () => {
    const id = Date.now();
    const maxZ = Math.max(0, ...elements.map(img => img.zIndex));
    setElements(prev => [
      ...prev,
      {
        id,
        type: 'image',
        src: sampleImg,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        zIndex: maxZ + 1,
      },
    ]);
  };

  const changeZIndex = (id, direction) => {
    setElements(prev =>
      prev.map(img => {
        if (img.id === id) {
          return {
            ...img,
            zIndex: direction === 'up'
              ? img.zIndex + 1
              : Math.max(1, img.zIndex - 1),
          };
        }
        return img;
      })
    );
  };

  const handleReorder = (id, direction) => {
    setElements(prev => reorderLayer(prev, id, direction));
  };

  const handleExport = (canvasElement) => {
    if (!canvasElement) {
      return
    }

    html2canvas(canvasElement, {
      backgroundColor: null,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'your-canvas.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const addText = () => {
    const id = Date.now();
    const maxZ = Math.max(0, ...elements.map(el => el.zIndex));
    const newText = {
      id,
      type: 'text',
      content: 'New Text',
      fontSize: 32,
      color: '#ffffff',
      x: 100,
      y: 100,
      zIndex: maxZ + 1,
      width: 200,
      height: 100,
    };
    setElements(prev => [...prev, newText]);
  };

  const selectedElement = elements.find(el => el.id === selectedId);



  return (
    <AppContainer>
      <Canvas
        elements={elements}
        onUpdate={updateElement}
        changeZIndex={changeZIndex}
        onSelect={(id) => setSelectedId(id)}
        ref={canvasRef}
        selectedId={selectedId}
      />
      <SidePanel>
        <Layers
          elements={elements}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onMove={handleReorder}
          onDelete={(id) => {
            setElements(prev => prev.filter(img => img.id !== id));
            if (selectedId === id) setSelectedId(null);
          }}
        />
        <AddImageButton onClick={addImage}>Add</AddImageButton>
        <ImageUploader onUpload={(src) => {
          const maxZ = Math.max(0, ...elements.map(img => img.zIndex));
          const newImage = {
            id: Date.now(),
            type: 'image',
            src,
            x: 100,
            y: 100,
            width: 250,
            height: 250,
            zIndex: maxZ + 1,
          };
          setElements((prev) => [...prev, newImage]);
        }} />
        <button onClick={addText}>Add Text</button>
        <button onClick={() => handleExport(canvasRef.current)}>Download PNG</button>
        {selectedElement?.type === 'text' && (
          <ColorPicker
            value={selectedElement.color}
            onChange={(newColor) => {
              updateElement(selectedElement.id, { color: newColor });
            }}
          />
        )}
        <button onClick={() => setShowLibrary(prev => !prev)}>
          Image Library
        </button>

        {showLibrary && (
          <ImageLibrary
            onSelect={(src) => {
              const img = new Image();
              img.src = src;

              img.onload = () => {
                const { naturalWidth, naturalHeight } = img;
                const maxZ = Math.max(0, ...elements.map(el => el.zIndex));

                // Set max dimension
                const MAX_SIZE = 300;

                // Calculate scaled dimensions
                const aspectRatio = naturalWidth / naturalHeight;
                let width = naturalWidth;
                let height = naturalHeight;

                if (width > MAX_SIZE || height > MAX_SIZE) {
                  if (aspectRatio > 1) {
                    // Wider than tall
                    width = MAX_SIZE;
                    height = MAX_SIZE / aspectRatio;
                  } else {
                    // Taller than wide
                    height = MAX_SIZE;
                    width = MAX_SIZE * aspectRatio;
                  }
                }

                setElements((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    type: 'image',
                    src,
                    x: 100,
                    y: 100,
                    width,
                    height,
                    zIndex: maxZ + 1,
                  },
                ]);
              };


              img.onerror = () => {
                console.error('Failed to load image:', src);
                setShowLibrary(false);
              };
            }}
            onClose={() => setShowLibrary(false)}
          />
        )}


      </SidePanel>
    </AppContainer>
  );
}

export default App;
