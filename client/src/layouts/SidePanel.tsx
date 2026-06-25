import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper,  } from '@mui/material';
import { Laptop, KeyboardArrowRight, Camera, Mic, Monitor, Phone, Print, Tablet, Tv, Watch, Computer } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/swiper-bundle.css';  // This single import replaces all individual CSS imports
import { useNavigate } from 'react-router-dom';
import { useFetchBannersQuery } from '../app/api/bannerApi';
import { useFetchCategoriesQuery } from '../app/api/categoryApi';

const getCategoryIcon = (catName: string) => {
    const nameLower = catName.toLowerCase();
    if (nameLower.includes('camera') || nameLower.includes('máy ảnh')) return <Camera />;
    if (nameLower.includes('laptop')) return <Laptop />;
    if (nameLower.includes('mic') || nameLower.includes('thu âm')) return <Mic />;
    if (nameLower.includes('màn hình')) return <Monitor />;
    if (nameLower.includes('pc') || nameLower.includes('máy tính')) return <Computer />;
    if (nameLower.includes('điện thoại')) return <Phone />;
    if (nameLower.includes('in') || nameLower.includes('printer')) return <Print />;
    if (nameLower.includes('tablet') || nameLower.includes('bảng')) return <Tablet />;
    if (nameLower.includes('tivi') || nameLower.includes('tv')) return <Tv />;
    if (nameLower.includes('đồng hồ') || nameLower.includes('watch')) return <Watch />;
    return <Laptop />; // fallback default icon
};

export default function SidePanel() {
    const {data: bannerItems} = useFetchBannersQuery()
    const {data: dbCategories, isLoading: isLoadingCats} = useFetchCategoriesQuery()
    const navigate = useNavigate();
    return (
        <Box 
            sx={{
                width: '100%',
                height: { xs: 'auto', md: 356 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                mb: 3,
                mt: 2,
            }}
        >
            <Paper 
                elevation={1}
                sx={{
                    width: { xs: '100%', md: '25%' },
                    height: { xs: 220, md: '100%' },
                    overflow: 'auto', // Cho phép scroll nếu có nhiều categories
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <List sx={{ p: 1 }}>
                    {isLoadingCats ? (
                        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                            Đang tải danh mục...
                        </Box>
                    ) : (
                        dbCategories?.map((category) => (
                            <ListItemButton
                                key={category.id}
                                sx={{
                                    position: 'relative', 
                                    overflow: 'hidden',
                                    height: 32,
                                    borderRadius: '8px',
                                    mb: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        color: 'primary.main',
                                    },
                                }}
                                onClick={() => navigate(`/products/category/${category.id}`)}
                            >
                                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                    {getCategoryIcon(category.displayName || category.name)}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={category.displayName || category.name}
                                    primaryTypographyProps={{
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                    }}
                                />
                                <KeyboardArrowRight 
                                    sx={{ 
                                        opacity: 0.5,
                                        fontSize: '18px',
                                        transition: 'all 0.2s ease',
                                        '.MuiListItemButton-root:hover &': {
                                            opacity: 1,
                                            transform: 'translateX(3px)'
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))
                    )}
                </List>
            </Paper>
            <Paper 
                elevation={3}
                sx={{ 
                    flex: 1,
                    width: '100%',
                    height: { xs: 220, md: '100%' },
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
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
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation={true} 
                    pagination={{
                        clickable: true,
                        type: 'bullets',
                    }}
                    slidesPerView={1}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false
                    }}
                    loop={true}
                    className="mySwiper"  
                    style={{ width: '100%', height: '100%' }}
                >
                    {(bannerItems && bannerItems.length > 0) && bannerItems.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                component="img"
                                src={item.url}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // 👈 giữ nguyên tỉ lệ ảnh
                                    backgroundColor: '#f5f5f5' // Tùy chọn nếu có khoảng trắng
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Paper>
        </Box>
    );
}