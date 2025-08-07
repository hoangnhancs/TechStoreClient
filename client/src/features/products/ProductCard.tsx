import { Box, Button, Card, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import {  Item, Product, User } from "../../lib/types";
import { Link, useNavigate } from "react-router-dom";
import discount from '../../assets/discount.png';
import { useState } from "react";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import { toast } from "react-toastify";
import { useAddBasketItemMutation } from "../../app/api/basketApi";
import { useGetCurrentUserQuery } from "../user/userApi";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../basket/basketSlice";
import { formatCurrency } from "../../lib/util/util";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';


// import { useAppSelector } from "../../hooks";

type Props = {
    product: Product;
    currentUser:User | undefined | null;
}

export default function ProductCard({product}: Props) {
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
    const {data: currentUser} = useGetCurrentUserQuery()
    const [addBasketItem, {isLoading}] = useAddBasketItemMutation()
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleAddToCart = () => {
        
        if (!currentUser?.id) {
            setOpenLoginPrompt(true); 
            return;
        }

        addBasketItem({
            productId: product.id,
            quantity: 1
        })
        .unwrap()
        .then(() => {
            toast.success(`Đã thêm sản phẩm ${product.name} vào giỏ hàng.`);
            dispatch(addItem({
                productId: product.id,
                productName: product.name,
                imageUrl: product.imageUrl,
                price: product.price,
                quantity: 1,
                brandId: product.brandId,
                category: product.category} as Item))
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            toast.error('Could not add item to cart. Please try again.');
        });
    }
  return (
    <Card
        elevation={3}    
        sx={{
            padding: 0.5,
            position: 'relative',
            height: 430,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'visible', // Để hiển thị phần thẻ giảm giá bên ngoài
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'scale(1.03) translateY(-10px)',
                boxShadow: 5,
            },
            cursor: 'pointer',
        }}
        onClick={() =>navigate(`/products/${product.id}`)}
    >
        {product.discountPercentage ? <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: -4,
                color: 'white',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 500,
                display: 'flex',
                width: {
                    xs: '80px',    // Màn hình nhỏ
                    sm: '90px',    // Tablet
                    md: '100px',   // Desktop
                },
                height: {
                    xs: '32px',
                    sm: '36px',
                    md: '40px',
                },
                alignItems: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                backgroundImage: `url(${discount})`,            
            }}
        >
            <Typography 
                variant="subtitle2" 
                sx={{
                    fontSize: {
                        xs: '0.6rem',
                        sm: '0.7rem',
                        md: '0.8rem',
                    }, 
                    transform:'translateY(-2px)'
                }}
            >
                Giảm {product.discountPercentage}%
            </Typography>  
        </Box> : null}
        <CardMedia
            component="img"
            sx={{
                height: 230,
                width: "100%",
                backgroundSize: 'cover',
                objectFit: 'contain',  
                mx: 'auto',  // Căn giữa hình ảnh
            }}
            image={product.imageUrl}
        >
        </CardMedia>
        <CardContent
            sx={{
                flexGrow: 1,
                minHeight: 150,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,     // Khoảng cách giữa các Typography
                alignItems: 'flex-start'  // Căn chỉnh các phần tử con từ đầu
            }}
        >
            <Typography
                gutterBottom
                sx={{
                    textTransform: "uppercase",
                    width: '100%',  // Chiếm toàn bộ chiều rộng
                    height: '3.5em', // hoặc 3em tùy độ cao dòng
                    lineHeight: '1.2em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: 0  // Loại bỏ margin mặc định
                
                }}
                variant="subtitle2"
            >
                {product.name}
            </Typography>
            {product.averageRating > 0 && 
                <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Rating
                        name="read-only-rating"
                        value={product.averageRating}
                        readOnly
                        precision={0.1}
                        size="medium"
                        sx={{
                            color: '#fbc02d', // màu vàng
                            '& .MuiRating-iconEmpty': {
                                color: '#ccc', // màu xám cho sao chưa chọn
                            },
                        }}
                    />
                    <Typography color="gray" sx={{ transform: 'translateY(3px)'}} variant="body2" alignSelf={"center"}>
                        ({product.averageRating}/5)
                    </Typography>
                </Box>
            }
            <Typography
                sx={{
                    color: 'secondary.main',
                    marginTop: 'auto',  // Đẩy xuống dưới cùng  
                }}
                variant="body1"
            >
                {formatCurrency(product.price)}
            </Typography>
        </CardContent>
        <CardActions
            sx={{
                justifyContent: 'space-between', 
                paddingTop: 0,
            }}
        >
            <Button 
                
                sx={{ 
                    background: 'linear-gradient(135deg, #44b4d6ff, #1b4594ff)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.03) translateY(-2px)',
                        boxShadow: 5,
                    },
                    color: "white",
                    width: '100px'
                }} 
                startIcon={<AddShoppingCartIcon />} 
                onClick={(e) => {handleAddToCart(); e.stopPropagation();}} 
                disabled={isLoading}>Thêm</Button>
            <Button 
                sx={{ 
                    background: 'linear-gradient(135deg, #44b4d6ff, #1b4594ff)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.03) translateY(-2px)',
                        boxShadow: 5,
                    },
                    color: "white",
                    width: '100px'
                }} 
                startIcon={<InfoIcon />} 
                component={Link} 
                to={`/products/${product.id}`}>Chi tiết</Button>
        </CardActions>
        <LoginPromptDialog 
        open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
    </Card>
  )
}