import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import { Review } from "../lib/types";

type Props = { 
    review: Review
}

export default function ReviewItem({ review }: Props) {
    const ratingMapping: Record<number, string> = {
        1: 'Rất tệ',
        2: 'Tệ',
        3: 'Bình thường',
        4: 'Tốt',
        5: 'Tuyệt vời',
    };
    return (
        <Box display={"flex"} id={review.id} sx={{ p: 1 }}>
            <Stack direction={"row"} spacing={2} alignItems="center" sx={{ width: 200 }} >
                <Avatar 
                    src={review.userImageUrl} 
                    alt={review.userDisplayName || 'Unknown'}
                    sx={{ width: 35, height: 35 }}
                >
                    {review.userDisplayName?.[0] || '?'}
                </Avatar>
                <Typography variant="body1" sx={{ ml: 2}}>
                    {review.userDisplayName || 'Người dùng ẩn'}
                </Typography>
            </Stack>
            <Box display={"flex"} flexDirection={"column"} ml={5} mt={1}>
                
                <Stack sx={{ mt: 1}} direction={"row"} alignItems={"center"} >
                    <Rating 
                        value={review.rating} 
                        precision={0.1} 
                        readOnly 
                        size="small"  
                    />
                    <Typography variant="subtitle2" fontWeight={"normal"} fontSize={10} ml={1} sx={{ transform: 'translateY(1px)'}}>
                        {ratingMapping[review.rating] || 'Chưa đánh giá'}
                    </Typography>
                </Stack>
                <Stack direction={"column"} spacing={1}  mt={3}>
                    <Typography variant="body2">
                        {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Typography>
                </Stack>
            </Box>  
        </Box>
    )
}