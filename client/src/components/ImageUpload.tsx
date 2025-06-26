import React, { useRef, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    onImagesChange: (images: File[]) => void;
}

const ImageUpload: React.FC<Props> = React.memo(({onImagesChange}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newImages = Array.from(e.target.files);
      const newImagesList = [...images, ...newImages];
      setImages(newImagesList);
      onImagesChange(newImagesList); 
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }

  return (
    <Box display="flex" alignItems="center" gap={1} flexWrap={'wrap'}>
      {images.map((img, idx) => (
        <Box 
          key={idx}
          sx={{
            width: 68,
            height: 68,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={URL.createObjectURL(img)}
            alt={`preview-${idx}`}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: 'rgba(255,255,255,0.8)',
              '&:hover': { background: 'rgba(255,255,255,1)' },
              p: '1px',
            }}
            onClick={() => handleRemoveImage(idx)}
          >
            <ClearIcon fontSize="inherit" sx={{fontSize: 16}} />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        color="primary"
        component="span"
        sx={{
          width: 140,
          height: 68,
          borderRadius: 2,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textTransform: 'none',
          border: 1,
          borderColor: "#ccc",
        }}
        startIcon={<PhotoCamera />}
        onClick={() => inputRef.current?.click()}
      >
        Thêm hình ảnh
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
})

export default ImageUpload;