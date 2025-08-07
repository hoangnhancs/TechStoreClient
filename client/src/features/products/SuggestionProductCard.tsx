import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../../lib/types";
import { useNavigate } from "react-router-dom";
import discount from '../../assets/discount.png';
import { formatCurrency } from "../../lib/util/util";


// import { useAppSelector } from "../../hooks";

type Props = {
    product: Product;
}

export default function SuggestionProductCard({product}: Props) {
    const navigate = useNavigate();
    return (
        <Card
            elevation={3}    
            sx={{
                padding: 0.5,
                position: 'relative',
                height: 400,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'visible', // Để hiển thị phần thẻ giảm giá bên ngoài
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.03) translateY(-10px)',
                    boxShadow: 5,
                },
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
                        xs: '68px',    // Màn hình nhỏ
                        sm: '78px',    // Tablet
                        md: '88px',   // Desktop
                    },
                    height: {
                        xs: '12px',
                        sm: '24px',
                        md: '28px',
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
                    height: 'fit-content',
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
                <Box display={'flex'} gap={1} alignItems={'center'} sx={{ mt: 2}}>
                    <Typography
                        sx={{
                            color: 'red',
                            marginTop: 'auto',  // Đẩy xuống dưới cùng  
                        }}
                        variant="body1"
                    >
                        {formatCurrency(product.price)}
                    </Typography>
                    <Typography
                        sx={{
                            color: 'gray',
                            marginTop: 'auto',  // Đẩy xuống dưới cùng  
                            textDecoration: 'line-through',
                        }}
                        variant="body2"
                    >
                        {formatCurrency(product.oldPrice)}
                    </Typography>
                </Box>     
            </CardContent>
        </Card>
    )
}