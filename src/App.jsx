import { useState } from 'react';
import Canvas from './components/Canvas';
import sampleImg from './sample.png';
import Layers from './components/Layers';
import ImageUploader from './components/ImageUploader';
import { reorderLayer } from './utils/reorderLayer';
import { useRef } from 'react';
import html2canvas from 'html2canvas';



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

  const [selectedId, setSelectedId] = useState(null);
  const [images, setImages] = useState([
    {
      id: 1,
      src: sampleImg,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      zIndex: 1
    },
  ]);

  const updateImage = (id, updates) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const addImage = () => {
    const id = Date.now();
    const maxZ = Math.max(0, ...images.map(img => img.zIndex));
    setImages(prev => [
      ...prev,
      {
        id,
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
    setImages(prev =>
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
    setImages(prev => reorderLayer(prev, id, direction));
  };

  const handleExport = (canvasElement) => {
    console.log("canv el ", canvasElement)
    if (!canvasElement) {
      console.log("no canvas element")
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



  return (
    <AppContainer>
      <Canvas
        images={images}
        onUpdate={updateImage}
        changeZIndex={changeZIndex}
        onSelect={(id) => setSelectedId(id)}
        ref={canvasRef}
      />
      <SidePanel>
        <Layers
          images={images}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onMove={handleReorder}
          onDelete={(id) => {
            setImages(prev => prev.filter(img => img.id !== id));
            if (selectedId === id) setSelectedId(null);
          }}
        />
        <AddImageButton onClick={addImage}>Add</AddImageButton>
        <ImageUploader onUpload={(src) => {
          const maxZ = Math.max(0, ...images.map(img => img.zIndex));
          const newImage = {
            id: Date.now(),
            src,
            x: 100,
            y: 100,
            width: 250,
            height: 250,
            zIndex: maxZ + 1,
          };
          setImages((prev) => [...prev, newImage]);
        }} />
        <button onClick={() => handleExport(canvasRef.current)}>Download PNG</button>


      </SidePanel>
    </AppContainer>
  );
}

export default App;
