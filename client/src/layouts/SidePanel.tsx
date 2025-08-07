import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper,  } from '@mui/material';
import { Laptop, KeyboardArrowRight, Camera, Mic, Monitor, Phone, Print, Tablet, Tv, Watch, Computer } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/swiper-bundle.css';  // This single import replaces all individual CSS imports
import { useNavigate } from 'react-router-dom';
import { useFetchBannersQuery } from '../app/api/bannerApi';

// Import modules

interface Category {
    id: number;
    name: string;
    icon: React.ReactNode;
}

// Data mẫu với icons
const categories: Category[] = [
    { id: 1, name: 'Camera', icon: <Camera /> },
    { id: 2, name: 'Laptop', icon: <Laptop /> },
    { id: 3, name: 'Mic thu âm', icon: <Mic /> },
    { id: 4, name: 'Màn hình', icon: <Monitor /> },
    { id: 5, name: 'PC', icon: <Computer /> },
    { id: 6, name: 'Điện thoại', icon: <Phone /> },
    { id: 7, name: 'Máy in', icon: <Print /> },
    { id: 8, name: 'Máy tính bảng', icon: <Tablet /> },
    { id: 9, name: 'Tivi', icon: <Tv /> },
    { id: 10, name: 'Đồng hồ', icon: <Watch /> },
];

export default function SidePanel() {
    const {data: bannerItems} = useFetchBannersQuery()
    const navigate = useNavigate();
    return (
        <Box 
            sx={{
                width: '100%',
                height: 356,
                display: 'flex',
                flexDirection: 'row', // Đặt Categories và Carousel ngang hàng
                gap: 2,
                mb: 3,
                mt: 2,
            }}
        >
            <Paper 
                elevation={3}
                sx={{
                    width: '25%', // Chiếm 30% chiều rộng
                    height: '100%',
                    overflow: 'auto', // Cho phép scroll nếu có nhiều categories
                    borderRadius: 5,
                    
                }}
            >
                <List sx={{ p: 1 , }}>
                    {categories.map((category) => (
                        <ListItemButton
                            key={category.id}
                            sx={{
                                position: 'relative', 
                                overflow: 'hidden',
                                height: 30,
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    backgroundColor: '#abd5f1ff',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-75%',
                                    width: '50%',
                                    height: '100%',
                                    background: 'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 100%)',
                                    transform: 'skewX(-20deg)',
                                },
                                '&:hover::before': {
                                    animation: 'sweep 0.5s ease-in-out',
                                },
                                '@keyframes sweep': {
                                    '0%': {
                                        left: '-75%',
                                    },
                                    '100%': {
                                        left: '125%',
                                    },
                                },
                            }}
                            onClick={() => navigate(`/products/category/${category.id}`)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {category.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={category.name}
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    
                                }}
                            />
                            <KeyboardArrowRight 
                                sx={{ 
                                    opacity: 0.5,
                                    transition: '0.5s',
                                    '.MuiListItemButton-root:hover &': {
                                        opacity: 1,
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>
            <Paper 
                elevation={3}
                sx={{ 
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 5,
                    
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