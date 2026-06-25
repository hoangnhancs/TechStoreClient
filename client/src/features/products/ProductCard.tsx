import { Box, Button, Card, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import {  Item, Product } from "../../lib/types";
import { Link, useNavigate } from "react-router-dom";
import discount from '../../assets/discount.png';
import { useState } from "react";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import { toast } from "react-toastify";
import { useAddBasketItemMutation } from "../../app/api/basketApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addItem } from "../basket/basketSlice";
import { formatCurrency } from "../../lib/util/util";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';


// import { useAppSelector } from "../../hooks";

type Props = {
    product: Product;
}

export default function ProductCard({product}: Props) {
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
    const currentUser = useAppSelector((state) => state.user.currentUser)
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
                imageUrl: product.mainImageUrl,
                price: product.price,
                quantity: 1,
                brandId: product.brandId,
                categoryId: product.categoryId,
            } as Item))
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
        height: 460,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.03) translateY(-10px)',
            boxShadow: 5,
        },
        cursor: 'pointer',
    }}
    onClick={() => navigate(`/products/${product.id}`)}
>
    {/* Discount Badge */}
    {product.discountPercentage ? (
        <Box
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
                    xs: '80px',
                    sm: '90px',
                    md: '100px',
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
                    transform: 'translateY(-2px)',
                }}
            >
                Giảm {product.discountPercentage}%
            </Typography>
        </Box>
    ) : null}

    {/* Product Image */}
    <CardMedia
        component="img"
        sx={{
            height: 230,
            width: '100%',
            backgroundSize: 'cover',
            objectFit: 'contain',
            mx: 'auto',
        }}
        image={product.mainImageUrl}
    />

    {/* Product Details */}
    <CardContent
        sx={{
            flexGrow: 1,
            minHeight: 150,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-start',
        }}
    >
        {/* Product Name */}
        <Typography
            gutterBottom
            sx={{
                textTransform: 'uppercase',
                width: '100%',
                height: '3.5em',
                lineHeight: '1.2em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0,
            }}
            variant="subtitle2"
        >
            {product.name}
        </Typography>

        {/* Rating */}
        {product.averageRating > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
                <Rating
                    name="read-only-rating"
                    value={product.averageRating}
                    readOnly
                    precision={0.1}
                    size="medium"
                    sx={{
                        color: '#fbc02d',
                        '& .MuiRating-iconEmpty': {
                            color: '#ccc',
                        },
                    }}
                />
                <Typography
                    color="gray"
                    sx={{ transform: 'translateY(3px)' }}
                    variant="body2"
                    alignSelf="center"
                >
                    ({product.averageRating}/5)
                </Typography>
            </Box>
        )}

        {/* Price Section */}
        <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
            {product.discountPercentage ? (
                <>
                    {/* Old Price */}
                    <Typography
                        sx={{
                            color: 'gray',
                            textDecoration: 'line-through',
                            fontSize: '0.9rem',
                        }}
                        variant="body2"
                    >
                        {formatCurrency(product.price)}
                    </Typography>
                    {/* Discounted Price */}
                    <Typography
                        sx={{
                            color: 'secondary.main',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                        }}
                        variant="body1"
                    >
                        {formatCurrency(
                            product.price -
                                (product.price * product.discountPercentage) /
                                    100
                        )}
                    </Typography>
                </>
            ) : (
                <Typography
                    sx={{
                        color: 'secondary.main',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                    }}
                    variant="body1"
                >
                    {formatCurrency(product.price)}
                </Typography>
            )}
        </Box>
    </CardContent>

    {/* Actions */}
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
                color: 'white',
                width: '100px',
            }}
            startIcon={<AddShoppingCartIcon />}
            onClick={(e) => {
                handleAddToCart();
                e.stopPropagation();
            }}
            disabled={isLoading}
        >
            Thêm
        </Button>
        <Button
            sx={{
                background: 'linear-gradient(135deg, #44b4d6ff, #1b4594ff)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.03) translateY(-2px)',
                    boxShadow: 5,
                },
                color: 'white',
                width: '100px',
            }}
            startIcon={<InfoIcon />}
            component={Link}
            to={`/products/${product.id}`}
        >
            Chi tiết
        </Button>
    </CardActions>

    {/* Login Prompt Dialog */}
    <LoginPromptDialog
        open={openLoginPrompt}
        onClose={() => setOpenLoginPrompt(false)}
    />
</Card>
  )
}