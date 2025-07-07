import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ReviewSignalRService } from "../../app/api/reviewSignalRService"
import { Review, User } from "../../lib/types"
import { Box, Button, Divider, Rating, Typography } from "@mui/material"
import { LinearProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddProductReviewPrompt from "../../components/AddProductReviewPrompt"
import LoginPromptDialog from "../../components/LoginPromptDialog"
import ReviewItem from "../../components/ReviewItem"

type Props = {
    productName: string
    currentUser: User | null
}

export default function ReviewList({ productName, currentUser }: Props) {
    const { id } = useParams()
    const [reviews, setReviews] = useState<Review[]>([])
    const [avgRating, setAvgRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [openAddReview, setOpenAddReview] = useState(false)
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false)
    const [displayedReviews, setDisplayedReviews] = useState<Review[]>([])
    const filterTags = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Có hình ảnh', value: 'images' },
        { label: '1 sao', value: '1' },
        { label: '2 sao', value: '2' },
        { label: '3 sao', value: '3' },
        { label: '4 sao', value: '4' },
        { label: '5 sao', value: '5' },]
    const [selectedFilterTag, setSelectedFilterTag] = useState<{label: string, value: string}>({ label: 'Tất cả', value: 'all' })
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    })
    useEffect(() => {
        let isMounted = true
        if (!id) {
            console.log("Product ID is null or undefined.");
            return
        }
        const connectAndLoadReviews = async () => {
            try {
                await ReviewSignalRService.createHubConnection(id, false);
                if (!isMounted) return;
                ReviewSignalRService.loadAllReviews(id, (loadedReviews) => {
                    if (isMounted) {
                        setReviews(loadedReviews);
                    }
                })
                if (!isMounted) return;

                ReviewSignalRService.onReceiveNewReview((newReview) => {
                    if (isMounted) {
                        setReviews((prevReviews) =>  [...prevReviews, newReview]);
                    }
                })
            } catch (error) {
                if (isMounted) {
                    console.error("Error during SignalR connection setup in ReviewList:", error);
                }
            }
        }
        connectAndLoadReviews();
        return () => {
            isMounted = false
            ReviewSignalRService.stopConnection();
        }
    }, [id])
    useEffect(() => {
        if (reviews.length === 0) return;
        const counts: { [key: number]: number } = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        reviews.forEach((review) => {  
            counts[review.rating]++;  
        });

        setRatingCounts(counts);
        setTotalReviews(reviews.length);
        setAvgRating(
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        );
    }, [reviews]);

    useEffect(() => {
        if (selectedFilterTag.value === 'all') {
            setDisplayedReviews(reviews);
        } else if (selectedFilterTag.value === 'images') {
            setDisplayedReviews(reviews);
        } else {
            const rating = parseInt(selectedFilterTag.value);
            const newDisplayedReviews = reviews.filter(review => review.rating === rating);
            setDisplayedReviews(newDisplayedReviews);
        }
    }, [selectedFilterTag, reviews]);

    const handleAddReview = (productId: string, review: string, rating: number) => {
        ReviewSignalRService.sendReview(productId, review, rating)
        setOpenAddReview(false)
    }

    const handleOpenAddNewReviewPrompt = () => {
        if (!currentUser) {
            setOpenLoginPrompt(true);
            return;
        }
        setOpenAddReview(true);
    }


    if (reviews.length === 0) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                border={1}
                borderColor="divider"
                borderRadius={2}
                maxWidth={'lg'}
                sx={{ 
                    mt: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    margin: '0 auto', 
                    px: 2,
                    py: 2,
                }} 
            >
                <Typography variant="h6" color="text.secondary">
                    Chưa có đánh giá nào cho sản phẩm này.
                </Typography>
                <Button 
                    variant="contained" 
                    color="error" 
                    sx={{ mt: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                    onClick={handleOpenAddNewReviewPrompt}
                >
                    Viết đánh giá
                </Button>
                <AddProductReviewPrompt onSubmit={handleAddReview} open={openAddReview} onClose={() => setOpenAddReview(false)} productName={productName} productId={id ?? ""} />
                <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
            </Box>
        )      
    }

    return (
        <Box 
            display={"flex"} 
            flexDirection="column" 
            alignItems="center" 
            gap={2} 
            sx={{ 
                mt: 5,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                margin: '0 auto', 
                px: 2,
                py: 2,
            }} 
            border={1} 
            borderColor="divider" 
            borderRadius={2} 
            maxWidth={'lg'}
        >
            <Box justifyContent={"start"} width={"100%"}>
                <Typography>Đánh giá sản phẩm {productName}</Typography>
            </Box>
            <Box display={"flex"} sx={{ px: 10, py: 3, mt: 1}} width={"100%"} alignItems="center" border={1} borderColor="divider" borderRadius={2}>
                <Box display={"flex"} flexDirection="column" alignItems="center" mr={2} width="30%">
                    <Box display="flex" justifyContent="center" alignItems="baseline" gap={0.5} >
                        <Typography variant="h4" fontWeight="bold">{avgRating.toFixed(1)}</Typography>
                        <Typography variant="h6" color="text.secondary">/5</Typography>
                    </Box>
                    <Rating 
                        value={avgRating} 
                        precision={0.1} 
                        readOnly 
                        size="small" 
                        sx={{ mt: 1 }} 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {totalReviews} lượt đánh giá
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="error" 
                        sx={{ mt: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                        onClick={handleOpenAddNewReviewPrompt}
                    >
                        Viết đánh giá
                    </Button>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box display={"flex"} flexDirection="column" width="70%" height="20%" alignItems={"center"}>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Box display={"flex"} alignItems="center" >
                            <Typography sx={{fontSize: 16,lineHeight: 1,mr: 0.2,display: 'flex',alignItems: 'center',position: 'relative',top: '1px',
                              }}
                            >
                              5
                            </Typography>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        </Box>   
                        <LinearProgress sx={{ width: 220, color: 'red', borderRadius: 2, height: 8 }} variant="determinate" value={ratingCounts[5]/reviews.length*100}/>
                        <Typography variant="body2" color="text.secondary">
                            {ratingCounts[5]} đánh giá
                        </Typography>
                    </Box>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Box display={"flex"} alignItems="center" >
                            <Typography sx={{fontSize: 16,lineHeight: 1,mr: 0.2,display: 'flex',alignItems: 'center',position: 'relative',top: '1px',
                              }}
                            >
                              4
                            </Typography>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        </Box>   
                        <LinearProgress sx={{ width: 220, color: 'red', borderRadius: 2, height: 8 }} variant="determinate" value={ratingCounts[4]/reviews.length*100}/>
                        <Typography variant="body2" color="text.secondary">
                            {ratingCounts[4]} đánh giá
                        </Typography>
                    </Box>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Box display={"flex"} alignItems="center" >
                            <Typography sx={{fontSize: 16,lineHeight: 1,mr: 0.2,display: 'flex',alignItems: 'center',position: 'relative',top: '1px',
                              }}
                            >
                              3
                            </Typography>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        </Box>   
                        <LinearProgress sx={{ width: 220, color: 'red', borderRadius: 2, height: 8 }} variant="determinate" value={ratingCounts[3]/reviews.length*100}/>
                        <Typography variant="body2" color="text.secondary">
                            {ratingCounts[3]} đánh giá
                        </Typography>
                    </Box>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Box display={"flex"} alignItems="center" >
                            <Typography sx={{fontSize: 16,lineHeight: 1,mr: 0.2,display: 'flex',alignItems: 'center',position: 'relative',top: '1px',
                              }}
                            >
                              2
                            </Typography>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        </Box>   
                        <LinearProgress sx={{ width: 220, color: 'red', borderRadius: 2, height: 8 }} variant="determinate" value={ratingCounts[2]/reviews.length*100}/>
                        <Typography variant="body2" color="text.secondary">
                            {ratingCounts[2]} đánh giá
                        </Typography>
                    </Box>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                        <Box display={"flex"} alignItems="center" >
                            <Typography sx={{fontSize: 16,lineHeight: 1,mr: 0.2,display: 'flex',alignItems: 'center',position: 'relative',top: '1px',
                              }}
                            >
                              1
                            </Typography>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: 18 }} />
                        </Box>   
                        <LinearProgress sx={{ width: 220, color: 'red', borderRadius: 2, height: 8 }} variant="determinate" value={ratingCounts[1]/reviews.length*100}/>
                        <Typography variant="body2" color="text.secondary">
                            {ratingCounts[1]} đánh giá
                        </Typography>
                    </Box>
                </Box>
            </Box>
            
            <Box
                sx={{ border: 1, borderRadius: 2, borderColor: 'divider', width: '100%'}} padding={2}
            >
                <Box marginY={1.25} display={"flex"} alignItems="center">
                    <Typography fontWeight={'bold'} marginRight={1}>
                        Lọc đánh giá theo
                    </Typography>
                    <Box gap={1} display="flex">
                        {filterTags.map((tag, idx) => (
                            <Button 
                                key={idx}
                                size="small"                            
                                sx={{ 
                                    borderRadius: '16px', 
                                    textTransform: 'none', 
                                    border: selectedFilterTag.label === tag.label ? '1px solid #3b82f6' : '1px solid #e4e4e7', 
                                    color: selectedFilterTag.label === tag.label ? '#2570eb' : '#1d1d20',
                                    backgroundColor: selectedFilterTag.label === tag.label ? '#eff5ff' : '#f7f7f8',
                                }}    
                                onClick={() => {
                                    setSelectedFilterTag(tag);
                                }}
                            >
                                {tag.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} >
                    {displayedReviews.map((review, index) => (
                        <Box key={review.id}>
                            <ReviewItem review={review} />
                            {index < reviews.length - 1 && (
                                <Divider sx={{ my: 2 }} />
                            )}
                        </Box>        
                    ))}
                </Box>
            </Box>
            
            <AddProductReviewPrompt onSubmit={handleAddReview} open={openAddReview} onClose={() => setOpenAddReview(false)} productName={productName} productId={id ?? ""} />
            <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
        </Box>
    )
}