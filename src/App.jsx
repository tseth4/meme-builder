import { useState } from 'react';
import Canvas from './components/Canvas';
import sampleImg from './sample.png';
import Layers from './components/Layers';

import styled from '@emotion/styled'

const AppContainer = styled.div`
  background: #333;
  color: #fff;
  width: 100vw;
  display: flex;
  position: relative;
  ${'' /* border: 2px solid brown; */}
`;
const AddImageButton = styled.button`
  background: black;
  color: white;
  width: 5em;
  height: auto;
  ${'' /* border: 1px solid green; */}
`;

const SidePanel = styled.div`
  ${'' /* border: 1px solid blue; */}
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
`


function App() {
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
    setImages(prev => [
      ...prev,
      {
        id,
        src: sampleImg,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        zIndex: 1
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


  return (
    <AppContainer>
      <Canvas images={images} onUpdate={updateImage} changeZIndex={changeZIndex} />
      <SidePanel>
        <Layers
          images={images}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onMove={(id, dir) => {
            setImages((prev) => {
              const maxZ = Math.max(...prev.map(i => i.zIndex));
              return prev.map(img => {
                if (img.id === id) {
                  let newZ = dir === 'up' ? img.zIndex + 1 : Math.max(1, img.zIndex - 1);
                  return { ...img, zIndex: Math.min(newZ, maxZ + 1) };
                }
                return img;
              });
            });
          }}
          onDelete={(id) => {
            setImages(prev => prev.filter(img => img.id !== id));
            if (selectedId === id) setSelectedId(null);
          }}
        />
        <AddImageButton onClick={addImage}>Add</AddImageButton>

      </SidePanel>

    </AppContainer>
  );
}

export default App;
