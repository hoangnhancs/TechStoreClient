import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../../lib/types";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../lib/util/util";


// import { useAppSelector } from "../../hooks";

type Props = {
    product: Product;
}

export default function SuggestionProductCard({product}: Props) {
    const navigate = useNavigate();
    return (
        <Card
            elevation={2}    
            sx={{
                padding: 1,
                position: 'relative',
                height: 410,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 12px 24px -10px rgba(56, 189, 248, 0.12)'
                      : '0 12px 24px -10px rgba(148, 163, 184, 0.25)',
                    borderColor: 'primary.light',
                },
            }}
            onClick={() => navigate(`/products/${product.id}`)}
        >
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
            
            {/* Image Container */}
            <Box 
              sx={{ 
                height: 200, 
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
                <Typography
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        height: '2.8em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0,
                        color: 'text.primary',
                    }}
                    variant="subtitle2"
                >
                    {product.name}
                </Typography>
                
                <Box display={'flex'} gap={1} alignItems={'center'} mt={1}>
                    <Typography
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: '1.15rem',
                        }}
                        variant="body1"
                    >
                        {formatCurrency(product.price)}
                    </Typography>
                    {product.oldPrice > product.price && (
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                opacity: 0.6,
                                textDecoration: 'line-through',
                                fontSize: '0.8rem',
                            }}
                            variant="body2"
                        >
                            {formatCurrency(product.oldPrice)}
                        </Typography>
                    )}
                </Box>     
            </CardContent>
        </Card>
    )
}