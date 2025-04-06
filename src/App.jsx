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
import { Plus, Library, Download } from 'lucide-react';


import styled from '@emotion/styled'

const AppContainer = styled.div`
  background: #333;
  color: #fff;
  width: 100vw;
  display: flex;
  position: relative;
  overflow: hidden;
`;
export const Button = styled.button`
  color: white;
  height: auto;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
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
      src: '/images/doge.jpg',
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
      fontFamily: 'Arial',
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
    if (!canvasElement) return;

    const PADDING = 10;
    const nodeList = canvasElement.querySelectorAll('[data-exportable="true"]');

    if (nodeList.length === 0) return;

    const rects = Array.from(nodeList).map(node => node.getBoundingClientRect());

    const minX = Math.max(0, Math.min(...rects.map(r => r.left)) - PADDING);
    const minY = Math.max(0, Math.min(...rects.map(r => r.top)) - PADDING);
    const maxX = Math.max(...rects.map(r => r.right)) + PADDING;
    const maxY = Math.max(...rects.map(r => r.bottom)) + PADDING;

    const cropWidth = maxX - minX;
    const cropHeight = maxY - minY;

    html2canvas(canvasElement, {
      backgroundColor: null,
      useCORS: true,
    }).then((fullCanvas) => {
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      const ctx = croppedCanvas.getContext('2d');

      ctx.drawImage(
        fullCanvas,
        minX, minY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      const link = document.createElement('a');
      link.download = 'cropped-image.png';
      link.href = croppedCanvas.toDataURL('image/png');
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
      fontFamily: 'Arial',
      x: 100,
      y: 100,
      zIndex: maxZ + 1,
      width: 200,
      height: 100,
    };
    setElements(prev => [...prev, newText]);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  // useEffect(() => {
  //   console.log("selectedElement: ", selectedElement)
  // }, [selectedElement])



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
        {/* <Button onClick={addImage}>Add</Button> */}
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
        <Button onClick={addText}>
          <Plus size={16} />
          Add Text
        </Button>
        <Button onClick={() => setShowLibrary(prev => !prev)}>
          <Library size={16} />
          Image Library
        </Button>
        <Button onClick={() => handleExport(canvasRef.current)}>
          <Download size={16} />
          Download PNG
        </Button>



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

        {selectedElement?.type === 'text' && (
          <>
            <ColorPicker
              value={selectedElement.color}
              onChange={(newColor) => {
                updateElement(selectedElement.id, { color: newColor });
              }}
            />
            <select
              value={selectedElement.fontSize}
              onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
            >
              {[12, 16, 20, 24, 32, 40, 48, 64].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
            <select
              value={selectedElement.fontFamily || 'Arial'}
              onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
            >
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>


          </>


        )}
      </SidePanel>
    </AppContainer>
  );
}

export default App;
