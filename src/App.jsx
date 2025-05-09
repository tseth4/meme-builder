import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Layers from './components/Layers';
import ImageUploader from './components/ImageUploader';
import { reorderLayer } from './utils/reorderLayer';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import ColorPicker from './components/ColorPicker';
import ImageLibrary from './components/ImageLibrary';
import { Plus, Library, Download, EditIcon } from 'lucide-react';


import styled from '@emotion/styled'


const AppContainer = styled.div`

  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background: #333;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  width: 260px;
  flex-shrink: 0;
  background: #1e1e1e;
  color: white;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  z-index: 10;
  overflow-y: auto;


  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    flex-direction: column;
    padding: 0.5em;
    gap: 0.5em;
  }   
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: space-around;

  @media (min-width: 769px) {
    flex-direction: column;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25em;
  cursor: pointer;

  &:hover {
    color: #00f2ff;
  }

  @media (min-width: 769px) {
    justify-content: flex-start;
    gap: 0.5em;

    &::after {
      content: attr(title);
      font-size: 0.9em;
    }
  }
`;


const CanvasWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: auto; 
  background:rgb(49, 49, 49);
  padding: 1rem;


  @media (max-width: 768px) {
    height: calc(100vh - 300px); /* match SidePanel height */
  }

`;

// TODO: Refreshing on mobile loads the canvas to far to the right and left. Canvas is going off the screen making it difficult to resize.


function App() {
  const canvasRef = useRef(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);

  const [canvasSize, setCanvasSize] = useState({
    width: 600, height: 600, x: 0, y: 0
  })
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

  useEffect(() => {
    const resizeCanvas = () => {
      const padding = 40;
      const maxWidth = window.innerWidth - padding;
      const maxHeight = window.innerHeight - (window.innerWidth < 768 ? 300 : padding); // account for mobile bottom panel

      const size = Math.min(maxWidth, maxHeight, 600); // max default canvas

      setCanvasSize({
        width: size,
        height: size,
        x: 0, // no longer used
        y: 0,
      });
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);



  const updateElement = (id, updates) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
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
    if (!canvasRef.current) return;

    html2canvas(canvasRef.current, {
      backgroundColor: '#fff', // or null for transparent
      useCORS: true,
      scale: 4, // higher resolution output
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'meme.png';
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


  return (
    <AppContainer>
      <CanvasWrapper>

        <Canvas
          elements={elements}
          onUpdate={updateElement}
          changeZIndex={changeZIndex}
          onSelect={(id) => setSelectedId(id)}
          ref={canvasRef}
          selectedId={selectedId}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
          isEditingCanvas={isEditingCanvas}
        // canvasWidth={null}
        // canvasHeight={null}
        />
      </CanvasWrapper>

      <SidePanel>
        <Button onClick={() => setIsEditingCanvas(prev => !prev)}>
          {isEditingCanvas ? 'Stop Editing Canvas' : 'Edit Canvas'}
        </Button>
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
        {/* <Button onClick={addText}>
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
        </Button> */}
        <ButtonRow>
          <IconButton onClick={() => setIsEditingCanvas(prev => !prev)} title="Edit Canvas">
            <EditIcon />
          </IconButton>
          <IconButton onClick={addText} title="Add Text">
            <Plus size={16} />
          </IconButton>
          <IconButton onClick={() => setShowLibrary(prev => !prev)} title="Image Library">
            <Library size={16} />
          </IconButton>
          <IconButton onClick={() => handleExport(canvasRef.current)} title="Download">
            <Download size={16} />
          </IconButton>
        </ButtonRow>



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
