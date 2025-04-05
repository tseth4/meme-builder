import React, { useRef } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '../App';


const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      onUpload(src); // Pass base64 image to parent
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button onClick={() => fileInputRef.current.click()}>
        <FileUp size={16} />

        Upload Image
      </Button>
    </>
  );
};

export default ImageUploader;
