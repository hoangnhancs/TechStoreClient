import { Box, Button, CircularProgress, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/swiper-bundle.css';  
import ProductAttributesPrompt from "../../components/ProductAttributesPrompt";
import type { Swiper as SwiperType } from 'swiper';
import { useAddBasketItemMutation } from "../../app/api/basketApi";
import { Item, Product, User } from "../../lib/types";
import LoadingComponent from "../../components/LoadingComponent";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks";
import { addItem } from "../basket/basketSlice";
import { formatCurrency } from "../../lib/util/util";

// Import modules

// interface StorageOptions {
//     [key: string]: number;
// }
// interface ColorOptions {
//     [key: string]: number;
// }

type Props = {
    product: Product | undefined;
    currentUser: User | undefined;
}

export default function ProductInformation({product, currentUser}: Props) { 
    const [openAttributesDetails, setOpenAttributesDetails] = useState(false);
    // const {data} = useGetCurrentUserQuery();
    const dispatch = useAppDispatch();
    const [addItemMutation, {isLoading}] = useAddBasketItemMutation();
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const handleAddToCart = () => {
        if (!currentUser?.id) {
            setOpenLoginPrompt(true); 
        }
        else{
            if (product) {
                addItemMutation({productId: product.id, quantity: quantity})
                .unwrap()
                .then(() => {
                    toast.success(`Đã thêm ${quantity} sản phẩm ${product.name} vào giỏ hàng.`);
                    dispatch(addItem({
                        productId: product.id,
                        productName: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        quantity: quantity,
                        brandId: product.brandId,
                        category: product.category} as Item));
                })
                .catch(error => {
                    console.error('Error adding item to cart:', error);
                    toast.error('Could not add item to cart. Please try again.');
                });
            }
        }
    }

    if (!product) {
        return (
            <LoadingComponent />
        );
    }

    const productDetails = [
        {label: 'Name', value: product.name},
        {label: 'Description', value: product.description},
        {label: 'Category', value: product.category.name},
        {label: 'Brand', value: product.brandName},
        {label: 'Quantity in stock', value: product.quantityInStock},
    ]

    return (
        <Box
            maxWidth={'lg'}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                margin: '0 auto',
                mb: 2,
            }}
        >
            <Box sx={{ mt: 0, mb: 1 }}>
                <Typography alignContent={'center'} variant="subtitle2" gutterBottom>{product.name}</Typography>
            </Box>
            <Divider sx={{color: 'Background', mb: 2}} />
            <Grid
                container 
                spacing={2}
                sx={{
                    width: '100%',
                    display: 'flex',                    
                }}
            >
                <Grid size={6}>
                    <Box
                        sx={{
                            flex: 1,
                            height: 320,
                            overflow: 'hidden',
                            mb: 2,
                            '& .swiper-button-next, & .swiper-button-prev': {
                                color: 'white',
                                background: 'rgba(0,0,0,0.5)',
                                width: '32px',
                                height: '60px',
                                transitionDuration: '0.3s',
                                '&:after': {
                                    fontSize: '20px'
                                },
                                '&:hover': {
                                    background: 'rgba(0,0,0,0.7)'
                                }
                            },
                            '& .swiper-button-next': {
                                right: '-32px',
                                borderTopLeftRadius: '50px',
                                borderBottomLeftRadius: '50px',
                                paddingLeft: '10px'
                            },
                            '& .swiper-button-prev': {
                                left: '-32px',
                                borderTopRightRadius: '50px',
                                borderBottomRightRadius: '50px',
                                paddingRight: '10px'
                            },
                            '&:hover': {
                                '& .swiper-button-next': {
                                    right: 0  // Slide vào khi hover
                                },
                                '& .swiper-button-prev': {
                                    left: 0   // Slide vào khi hover
                                }
                            },
                            '& .swiper-pagination-bullet': {
                                backgroundColor: 'white',
                                opacity: 0.5,
                                '&-active': {
                                    opacity: 1
                                }
                            }
                        }}
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Thumbs]}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                type: 'bullets',
                            }}
                            thumbs={{ swiper: thumbsSwiper }}
                            className="mySwiper"
                            style={{ width: '100%', height: 320, borderRadius: '20px' }}
                        >
                            <SwiperSlide key="main-slide">
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: product.description && product.description.length > 0
                                            ? 'linear-gradient(90deg, #dd5e89, #f7bb97)'
                                            : '#fff',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 220,
                                            width: '100%',
                                            p: 1.25,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 220,
                                                height: 220,
                                                objectFit: 'contain',
                                                mx: 'auto',
                                                borderRadius: 2,
                                            }}
                                            component={'img'}
                                            src={product.imageUrl}
                                        />
                                        {product.description && product.description.length > 0 && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: 220,
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="h5" textAlign={'center'} sx={{ mb: 1, color: 'white' }}>MÔ TẢ SẢN PHẨM</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        color: '#fff',
                                                        pl: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'flex-start',
                                                        overflowY: 'scroll',
                                                        pr: 1,
                                                        scrollbarWidth: 'none', // Firefox
                                                        '&::-webkit-scrollbar': {
                                                            display: 'none', // Chrome, Safari
                                                        },
                                                    }}
                                                >
                                                    {product.description.map((desc, index) => (
                                                        <Typography key={index} variant="subtitle2" sx={{ mb: 1 }}>• {desc}</Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </SwiperSlide>
                            {product.images.map((item, index) => (
                                <SwiperSlide key={`main-${index}`}>
                                    <Box
                                        component="img"
                                        src={item.imageUrl}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                    <Box
                        sx={{
                            '& .swiper-slide-thumb-active img': {
                                border: '1px solid #d70018 !important',
                                opacity: 1
                            }
                        }}
                    >
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            modules={[Thumbs]} 
                            slidesPerView={Math.min(product.images.length + 1, 6)}
                            spaceBetween={8}
                            watchSlidesProgress
                            style={{ 
                                marginBottom: 16, 
                                height: 70, 
                                width: '100%',
                            }}
                        >
                            <SwiperSlide key="thumb-main">
                            <Box
                                component="img"
                                src={product.imageUrl}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    border: '2px solid #eee',
                                    cursor: 'pointer'
                                }}
                            />
                        </SwiperSlide>
                        {product.images.map((item, index) => (
                            <SwiperSlide key={`thumb-${index}`}>
                                <Box
                                    component="img"
                                    src={item.imageUrl}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '2px solid #eee',
                                        cursor: 'pointer'
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    </Box>
                      
                    {/* <Grid container spacing={{ xs: 1, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {Object.entries(dungluong).map(([label, value]) => (
                            <Grid sx={{borderRadius: '10px'}} key={label} size={{ xs: 2, sm: 4, md: 4 }}>
                                <Box
                                    sx={{
                                    position: 'relative',
                                    borderRadius: '10px',
                                    
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            borderRadius: '10px', 
                                            border: isSelected ? '2px solid #d70018' : '1px solid grey',
                                            color: 'black'
                                        }}
                                    >
                                        {label} - {value} GB
                                    </Button>
                                    {isSelected && (
                                        <Box
                                            sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: '#d70018',
                                            color: '#fff',
                                            fontSize: '10px',
                                            height: '15px',
                                            width: '20px',
                                            borderRadius: '0 10px 0 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',   
                                            }}
                                        >
                                            ✓
                                        </Box>
                                    )} 
                                </Box> 
                            </Grid>
                        ))}
                    </Grid> */}
                    {/* <Divider sx={{mt: 2, mb: 1}} />
                    <Typography>Chọn màu để xem giá và chi nhánh có hàng</Typography>
                    <Grid container spacing={{ xs: 1, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {Object.entries(mausac).map(([label, value]) => (
                            <Grid sx={{borderRadius: '10px'}} key={label} size={{ xs: 2, sm: 4, md: 4 }}> 
                            <Box
                                sx={{
                                position: 'relative',
                                borderRadius: '10px',    
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        borderRadius: '10px', 
                                        border: isSelected ? '2px solid #d70018' : '1px solid grey',
                                        color: 'black'
                                    }}
                                >
                                    <Box 
                                        sx={{
                                        display: 'flex', 
                                        alignItems: 'center',
                                        width: '100%',
                                        gap: 1,
                                        maxHeight: 30,
                                        }}
                                    >
                                        <Box
                                            component={'img'}
                                            src={product.imageUrl}
                                            sx={{ 
                                                height: 35,
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                ml: -1.5,
                                            }}      
                                        >
                                        </Box>  
                                        <Box
                                            sx={{
                                                textAlign: 'left',
                                                flex: 1,
                                                ml:1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                fontSize: '12px',                                                               
                                                }}
                                            >
                                                {label}
                                            </Box>
                                            <Box
                                                sx={{
                                                fontSize: '12px',                                
                                                }}
                                            >
                                                {value}
                                            </Box>          
                                        </Box>  
                                    </Box>
                                </Button>
                                {isSelected && (
                                <Box
                                    sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: '#d70018',
                                    color: '#fff',
                                    fontSize: '10px',
                                    height: '15px',
                                    width: '20px',
                                    borderRadius: '0 10px 0 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',   
                                    }}
                                >
                                    ✓
                                </Box>
                                )} 
                            </Box>                  
                            </Grid>
                        ))}
                    </Grid> */}
                    <Box 
                        display={'inline-flex'} 
                        flexDirection={'column'} 
                        gap={1}
                        width={'auto'}
                        sx={{ padding: "14px 24px", mt: 2, border: '1px solid rgb(157 168 219)', borderRadius: '16px' }}
                    >
                        <Typography variant="subtitle1">Giá sản phẩm</Typography>
                        <Box sx={{display: "flex", justifyContent: "start", alignItems: "center", gap: 2}}>
                            <Typography alignItems={'center'} variant="body2" fontWeight={'600'} fontSize={'24px'} color="#1d1d20">{formatCurrency(product.price)}</Typography>
                            <Typography alignItems={'center'} variant="body1" fontWeight={'400'} fontSize={'16px'} color="#a1a1aa" sx={{ textDecoration: 'line-through'}}>{formatCurrency(product.oldPrice)}</Typography>
                        </Box>                        
                    </Box>                    
                </Grid>
                <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'} 
                    >
                        <Typography>Thông số kỹ thuật</Typography>
                        <Button sx={{ alignItems: 'center' }} onClick={() => setOpenAttributesDetails(true)}>Xem chi tiết</Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableBody>
                            {productDetails.map((detail, index) => (
                                <TableRow key={index}>
                                <TableCell sx={{ fontWeight: 'bold', alignItems: 'left', width: '30%', verticalAlign: 'top' }}>
                                    {detail.label}
                                </TableCell>
                                <TableCell>
                                    {detail.label === 'Description' && Array.isArray(detail.value)
                                    ? detail.value.join(', ')
                                    : detail.value}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <TextField
                            label="Quantity add to basket"
                            variant="outlined"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            fullWidth
                        />  
                    </Grid>
                    <Grid size={6}>
                        <Button
                            color="primary"
                            size="large"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleAddToCart} 
                            disabled={isLoading || product.quantityInStock <= 0}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add to Basket'}
                        </Button>
                    </Grid>
                </Grid>     
            </Grid>
            <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
            <ProductAttributesPrompt attributes={product.attributes} open={openAttributesDetails} onClose={() => setOpenAttributesDetails(false)} />
        </Box>   
    )
}