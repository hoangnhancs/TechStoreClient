import React, { useEffect, useRef, useState } from 'react';
import { Box, BoxProps, Button, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    onImagesChange: (images: (File | string)[]) => void;
    maxImages?: number,
    defaultImages?: string[] 
    resetKey?: boolean,
    onChangeResetkey?: (resetKey: boolean) => void
} & BoxProps

const ImageUpload: React.FC<Props> = React.memo(( props: Props) => {
  const { onImagesChange, maxImages, defaultImages, onChangeResetkey, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<(string | File)[]>([]);

  // useEffect(() => {
  //   console.log("Images changed:", images);
  // }, [images]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (defaultImages && defaultImages.length > 0 && !hasInitialized.current) {
      setImages([...defaultImages]);
      onImagesChange([...defaultImages]);
      hasInitialized.current = true;
    }
  }, [defaultImages, onImagesChange]);

  //defaultimage được truyền từ updatedProduct là bất đồng bộ, ban đầu chưa có data
  //neu không dùng ref thì sẽ bị gì đó, dẫn đến liên tục setimages là defaultImages
  //nên xác định khi nào có value mới gán, và chỉ gán đúng 1 gần


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files?.length) return;

    if (e.target.files?.length ) {
      const newImages = Array.from(e.target.files);
      const newImagesList = [...images, ...newImages].slice(0, maxImages);
      setImages(newImagesList);
      onImagesChange(newImagesList); 
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }

  useEffect(() => {
    if (props.resetKey && onChangeResetkey) {
      setImages([]);
      onChangeResetkey(false);
    }
  }, [props.resetKey, onChangeResetkey]);

  return (
    <Box display="flex" alignItems="center" gap={1} flexWrap={'wrap'}>
      {images.map((img, idx) => (
        <Box 
          key={idx}
          sx={{
            width:  68,
            height:  68,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...rest,
          }}
        >
          <Box
            component="img"
            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
            alt={`preview-${idx}`}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 1,
              objectFit: 'contain',
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
        onClick={() => {
          if (maxImages && images.length >= maxImages) {
            alert(`Bạn chỉ có thể upload tối đa ${maxImages} hình ảnh cho mục này. Nếu muốn upload hình ảnh khác, hãy xóa bớt hình ảnh đã upload trước đó.`);
            return;
          }
          inputRef.current?.click()
        }}
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