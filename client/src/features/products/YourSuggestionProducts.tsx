
import { Box, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';  
import { useFetchSuggestionProductsQuery } from '../../app/api/productApi';
import SuggestionProductCard from './SuggestionProductCard';
import { Navigation, Autoplay } from 'swiper/modules';


export default function ProductSwiper() {
    const { data: suggestionProducts } = useFetchSuggestionProductsQuery();
    return (
        <Box 
            sx={{ 
                padding: 3, 
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 50%, #faf5ff 100%)',
                borderRadius: '16px', 
                overflow: 'visible',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.3)'
                    : '0 8px 32px rgba(99,102,241,0.05)',
            }} 
        >
            {/* <Box
                sx={{
                    width: '50px', // Kích thước nhỏ hơn để tạo hình ngôi sao nhỏ bên trong
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #1BA1E3, #5489D6, #9B72CB, #D96570, #F49C46)', // Tạo gradient cho hình nhỏ
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Tạo hình ngôi sao nhỏ
                }}
            /> */}
            
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, borderRadius: 'inherit' }}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="40" height="40" 
                    viewBox="0 0 1080 1080" 
                    fill="none">
                    <path 
                        d="M515.09 725.824L472.006 824.503C455.444 862.434 402.954 862.434 
                        386.393 824.503L343.308 725.824C304.966 638.006 235.953 568.104 149.868 
                        529.892L31.2779 477.251C-6.42601 460.515 -6.42594 405.665 31.2779 
                        388.929L146.164 337.932C234.463 298.737 304.714 226.244 342.401 135.431L386.044 
                        30.2693C402.239 -8.75637 456.159 -8.75646 472.355 30.2692L515.998 
                        135.432C553.685 226.244 623.935 298.737 712.234 337.932L827.121 
                        388.929C864.825 405.665 864.825 460.515 827.121 477.251L708.53 
                        529.892C622.446 568.104 553.433 638.006 515.09 725.824Z" 
                        fill="url(#paint0_radial_2525_777)"
                    >
                    </path> 
                    <path d="M915.485 1036.98L903.367 1064.75C894.499 1085.08 866.349 1085.08 857.481 
                        1064.75L845.364 1036.98C823.765 987.465 784.862 948.042 736.318 926.475L698.987 
                        909.889C678.802 900.921 678.802 871.578 698.987 862.61L734.231 846.951C784.023 
                        824.829 823.623 783.947 844.851 732.75L857.294 702.741C865.966 681.826 894.882 
                        681.826 903.554 702.741L915.997 732.75C937.225 783.947 976.826 824.829 1026.62 
                        846.951L1061.86 862.61C1082.05 871.578 1082.05 900.921 1061.86 909.889L1024.53 
                        926.475C975.987 948.042 937.083 987.465 915.485 1036.98Z" 
                        fill="url(#paint1_radial_2525_777)"
                    >
                    </path>
                    <defs><radialGradient id="paint0_radial_2525_777" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670.447 474.006) rotate(78.858) scale(665.5 665.824)"><stop stopColor="#1BA1E3"></stop> <stop offset="0.0001" stopColor="#1BA1E3"></stop> <stop offset="0.300221" stopColor="#5489D6"></stop> <stop offset="0.545524" stopColor="#9B72CB"></stop> <stop offset="0.825372" stopColor="#D96570"></stop> <stop offset="1" stopColor="#F49C46"></stop></radialGradient> <radialGradient id="paint1_radial_2525_777" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670.447 474.006) rotate(78.858) scale(665.5 665.824)"><stop stopColor="#1BA1E3"></stop> <stop offset="0.0001" stopColor="#1BA1E3"></stop> <stop offset="0.300221" stopColor="#5489D6"></stop> <stop offset="0.545524" stopColor="#9B72CB"></stop> <stop offset="0.825372" stopColor="#D96570"></stop> <stop offset="1" stopColor="#F49C46"></stop></radialGradient>
                    </defs>
                </svg>
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 700, flexGrow: 1, color: 'text.primary'}}>
                    GỢI Ý CHO BẠN
                </Typography>
                <Button sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    Xem thêm
                </Button>
            </Box>
            <Box
                sx={{
                    '& .swiper-button-next, & .swiper-button-prev': {
                        color: 'white',
                        background: 'rgba(0,0,0,0.5)',
                        width: '40px',
                        height: '40px',     
                        borderRadius: '50%',  
                        transitionDuration: '0.3s',
                        '&:after': {
                            fontSize: '20px'
                        },
                        '&:hover': {
                            background: 'rgba(0,0,0,0.7)'
                        }
                    },
                    '& .swiper-button-next': {
                        borderTopLeftRadius: '50%',
                        borderBottomLeftRadius: '50%',
                        paddingLeft: '10px',

                    },
                    '& .swiper-button-prev': {
                        borderTopRightRadius: '50%',
                        borderBottomRightRadius: '50%',
                        paddingRight: '10px',
                    },
                    '& .swiper-pagination-bullet': {
                        backgroundColor: 'white',
                        opacity: 0.5,
                        '&-active': {
                            opacity: 1
                        }
                    },
                    overflow: 'visible',
                    position: 'relative'
                }}
            >
                <Swiper 
                    style={{ height: 450 }}
                    spaceBetween={5} 
                    modules={[Navigation, Autoplay]}
                    navigation={true} 
                    pagination={{
                        clickable: true,
                        type: 'bullets',
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false
                    }}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1.5, spaceBetween: 10 },
                        480: { slidesPerView: 2.2, spaceBetween: 12 },
                        768: { slidesPerView: 3.2, spaceBetween: 16 },
                        1024: { slidesPerView: 4, spaceBetween: 20 },
                        1200: { slidesPerView: 5, spaceBetween: 20 }
                    }}
                >
                    {suggestionProducts?.map((product, index) => (
                        <SwiperSlide key={index} style={{ display: "flex", height: "100%", alignItems: "center" }}>
                            <Box sx={{ padding: "0 10px", width: "100%", boxSizing: "border-box" }}>
                                <SuggestionProductCard product={product} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            
        </Box>
    );
}
