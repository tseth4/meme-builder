import { useState } from 'react';
import Canvas from './components/Canvas';
import sampleImg from './sample.png';

function App() {
  const [images, setImages] = useState([
    {
      id: 1,
      src: sampleImg,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
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
      },
    ]);
  };

  return (
    <div style={{ width: '100vw' }}>
      <button onClick={addImage}>Add Image</button>
      <Canvas images={images} onUpdate={updateImage} />
    </div>
  );
}

export default App;
