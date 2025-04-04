import React, { useRef } from 'react';

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
      <button onClick={() => fileInputRef.current.click()}>
        Upload Image
      </button>
    </>
  );
};

export default ImageUploader;
