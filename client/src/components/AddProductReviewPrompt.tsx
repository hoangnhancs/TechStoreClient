import { useState } from 'react';
import { Box, Button, Typography, Rating, TextField, Stack, DialogTitle, Dialog, DialogContent, DialogActions } from '@mui/material';
import ratingCat from '../assets/rating_cat.png'
import ImageUpload from './ImageUpload';

type ExperienceRatings = {
  battery: number;
  performance: number;
  screen: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    productName: string;
    productId: string;
    onSubmit: (productId: string, review: string, rating: number) => void;
}

export default function AddProductReviewPrompt({ open, onClose, productName, productId, onSubmit }: Props) {
  const [overallRating, setOverallRating] = useState<number | null>(5);
  const [experienceRatings, setExperienceRatings] = useState<ExperienceRatings>({
    battery: 5,
    performance: 5,
    screen: 5,
  });
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);



  const handleSubmit = () => {
    if (content.length < 15) return;
    onSubmit(productId, content, overallRating || 1);
    console.log({
      overallRating,
      experienceRatings,
      content,
      images,
    });
    setContent('');
    setImages([]);
  };

  const handleClose = () => {
    setOverallRating(5);
    setExperienceRatings({
      battery: 5,
      performance: 5,
      screen: 5,
    });
    setContent('');
    setImages([]);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 5}}>
      <DialogTitle sx={{backgroundColor: '#f4f6f8'}}>Đánh giá & nhận xét</DialogTitle>
        <DialogContent>
          <Box p={3} maxWidth={500} mx="auto">
            <Box display={'flex'} alignItems={'center'}>
              <Box
                component={'img'}
                src={ratingCat}
              >
              </Box>
              <Typography>
                {productName}
              </Typography>
            </Box>
                <Typography mt={2} fontWeight={"bold"}>Đánh giá chung</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={32 * 5} // hoặc 160, tuỳ fontSize của icon
                  mx="auto"
                >
                    <Rating
                        name="overall-rating"
                        value={overallRating}
                        onChange={(_, newValue) => setOverallRating(newValue)}
                        sx={{ gap: 6, transform: 'translateX(24px)' }}
                        max={5}
                        precision={1}
                        size='large'
                    />
                </Box>
                
            <Typography mt={2} fontWeight="bold">Theo trải nghiệm</Typography>
            <Stack direction="row" alignItems="center" mt={1}>
                <Typography flex={1}>Thời lượng pin</Typography>
                <Rating
                value={experienceRatings.battery}
                onChange={(_, val) =>
                    setExperienceRatings({ ...experienceRatings, battery: val || 0 })
                }
                />
            </Stack>
            <Stack direction="row" alignItems="center" mt={1}>
                <Typography flex={1}>Hiệu năng</Typography>
                <Rating
                value={experienceRatings.performance}
                onChange={(_, val) =>
                    setExperienceRatings({ ...experienceRatings, performance: val || 0 })
                }
                />
            </Stack>
            <Stack direction="row" alignItems="center" mt={1}>
                <Typography flex={1}>Màn hình</Typography>
                <Rating
                value={experienceRatings.screen}
                onChange={(_, val) =>
                    setExperienceRatings({ ...experienceRatings, screen: val || 0 })
                }
                />
            </Stack>
            <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 kí tự)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <ImageUpload onImagesChange={setImages} maxImages={5} resetKey={images.length===0} />
        </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            sx={{ mt: 2, backgroundColor: 'white', color: '#333' }}
            onClick={handleClose} 
          >
              Đóng
          </Button>
          <Button 
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={content.length < 15}
              onClick={handleSubmit}
          >
              Gửi đánh giá
          </Button>
        </DialogActions>
    </Dialog>
  );
}