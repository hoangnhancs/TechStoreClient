import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import {  Item, Product, User } from "../../lib/types";
import { Link } from "react-router-dom";
import discount from '../../assets/discount.png';
import { useState } from "react";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import { toast } from "react-toastify";
import { useAddBasketItemMutation } from "../../app/api/basketApi";
import { useGetCurrentUserQuery } from "../user/userApi";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../basket/basketSlice";

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
    const handleAddToCart = () => {
        
        console.log(currentUser)
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
                brand: product.brand,
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
            position: 'relative',
            height: 400,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'visible', // Để hiển thị phần thẻ giảm giá bên ngoài
        }}
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
                minHeight: 50,
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
                    minHeight: '2.5em',  // Chiều cao tối thiểu 2 dòng
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
            <Typography
                sx={{
                    color: 'secondary.main',
                    marginTop: 'auto',  // Đẩy xuống dưới cùng  
                }}
                variant="h6"
            >
                ${(product.price / 100).toFixed(2)}
            </Typography>
        </CardContent>
        <CardActions
            sx={{
                justifyContent: 'space-between', 
                height: 50,
                paddingTop: 0,
            }}
        >
            <Button onClick={handleAddToCart} disabled={isLoading}>Add to cart</Button>
            <Button component={Link} to={`/products/${product.id}`}>View</Button>
        </CardActions>
        <LoginPromptDialog 
        open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
    </Card>
  )
}