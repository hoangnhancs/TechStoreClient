import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Paper, Divider } from '@mui/material';
import { Laptop, Checkroom, MenuBook, KeyboardArrowRight } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/swiper-bundle.css';  // This single import replaces all individual CSS imports

// Import modules



interface Category {
    id: number;
    name: string;
    icon: React.ReactNode;
}

// Data mẫu với icons
const categories: Category[] = [
    { id: 1, name: 'Electronics', icon: <Laptop /> },
    { id: 2, name: 'Clothing', icon: <Checkroom /> },
    { id: 3, name: 'Books', icon: <MenuBook /> },
];

const bannerItems = [
    {
        image: "/images/banner1.jpg",
        title: "Summer Sale"
    },
    {
        image: "/images/banner2.jpg",
        title: "New Arrivals"
    },
    {
        image: "/images/banner3.jpg",
        title: "Hot deals weekend"
    },
    {
        image: "/images/banner3.jpg",
        title: "Hot deals weekend"
    },
    // ...thêm các banner khác
];

export default function SidePanel() {
    return (
        <Box 
            sx={{
                width: '100%',
                height: 300,
                display: 'flex',
                flexDirection: 'row', // Đặt Categories và Carousel ngang hàng
                gap: 2,
                mb: 3,
            }}
        >
            <Paper 
                elevation={3}
                sx={{
                    width: '30%', // Chiếm 30% chiều rộng
                    height: '100%',
                    overflow: 'auto', // Cho phép scroll nếu có nhiều categories
                    borderRadius: 5,
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        p: 2, 
                        borderBottom: '1px solid #eee',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    Categories
                </Typography>
                <Divider />
                <List sx={{ p: 1 }}>
                    {categories.map((category) => (
                        <ListItemButton
                            key={category.id}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
         
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {category.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={category.name}
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    '.MuiListItemButton-root:hover &': {
                                        color: 'primary.main'
                                    }
                                }}
                            />
                            <KeyboardArrowRight 
                                sx={{ 
                                    opacity: 0.5,
                                    transition: '0.2s',
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
                    navigation={true}  // Make sure this is explicitly set to true
                    pagination={{
                        clickable: true,
                        type: 'bullets',
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false
                    }}
                    loop={true}
                    className="mySwiper"  // Add a custom class
                    style={{ width: '100%', height: '100%' }}
                >
                    {bannerItems.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                component="img"
                                src={item.image}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Paper>
        </Box>
    );
}