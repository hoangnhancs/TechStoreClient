import { Box, Button, Card, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import {  Item, Product } from "../../lib/types";
import { Link, useNavigate } from "react-router-dom";
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
    <>
      <Card
        elevation={2}
        sx={{
          padding: 1,
          position: 'relative',
          height: 480,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 12px 24px -10px rgba(56, 189, 248, 0.15)'
              : '0 12px 24px -10px rgba(148, 163, 184, 0.3)',
            borderColor: 'primary.light',
          },
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Discount Badge */}
        {product.discountPercentage ? (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              color: 'white',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              zIndex: 10,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            -{product.discountPercentage}%
          </Box>
        ) : null}

        {/* Product Image Container */}
        <Box 
          sx={{ 
            height: 220, 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            borderRadius: '12px',
            p: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.5s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.05)',
              }
            }}
            image={product.mainImageUrl}
            alt={product.name}
          />
        </Box>

        {/* Product Details */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: 1,
            py: 2,
            '&:last-child': { pb: 1 }
          }}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            {/* Product Name */}
            <Typography
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: '0.925rem',
                lineHeight: '1.4',
                height: '2.8em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0,
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
              variant="subtitle2"
            >
              {product.name}
            </Typography>

            {/* Rating */}
            {product.averageRating > 0 ? (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Rating
                  name="read-only-rating"
                  value={product.averageRating}
                  readOnly
                  precision={0.1}
                  size="small"
                  sx={{ color: '#ffb300' }}
                />
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                >
                  ({product.averageRating.toFixed(1)})
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: 18 }} /> // Spacing if no rating
            )}
          </Box>

          {/* Price Section */}
          <Box display="flex" flexDirection="column" mt={1}>
            {product.discountPercentage ? (
              <>
                {/* Old Price */}
                <Typography
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'line-through',
                    fontSize: '0.8rem',
                    opacity: 0.7,
                  }}
                  variant="body2"
                >
                  {formatCurrency(product.price)}
                </Typography>
                {/* Discounted Price */}
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                  variant="body1"
                >
                  {formatCurrency(
                    product.price - (product.price * product.discountPercentage) / 100
                  )}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  mt: 1.6, // Keep height alignment consistent with discounted items
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
            gap: 1,
            px: 1,
            pb: 1.5,
            pt: 0,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              flex: 1,
              py: 0.75,
              fontSize: '0.8rem',
              borderRadius: '8px',
            }}
            startIcon={<AddShoppingCartIcon fontSize="small" />}
            onClick={(e) => {
              handleAddToCart();
              e.stopPropagation();
            }}
            disabled={isLoading}
          >
            Thêm
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              flex: 1,
              py: 0.75,
              fontSize: '0.8rem',
              borderRadius: '8px',
            }}
            startIcon={<InfoIcon fontSize="small" />}
            component={Link}
            to={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            Chi tiết
          </Button>
        </CardActions>
      </Card>

      {/* Login Prompt Dialog */}
      <LoginPromptDialog
        open={openLoginPrompt}
        onClose={() => setOpenLoginPrompt(false)}
      />
    </>
  );
}