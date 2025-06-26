import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Thumbs } from "swiper/modules";
import { Box } from "@mui/material";

export default function AboutPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
  const testImgUrls = [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-ip-wifi-ngoai-troi-tiandy-h333n-3mp-fullcolor_3_.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-ip-wifi-ngoai-troi-tiandy-h333n-3mp-fullcolor.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-ip-wifi-ngoai-troi-tiandy-h333n-3mp-fullcolor_2_.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-ip-wifi-ngoai-troi-tiandy-h333n-3mp-fullcolor_1_.png"
  ]
  return (
    <main>
        {/* Main Swiper -> pass thumbs swiper instance */}
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
          <Swiper modules={[Thumbs]} thumbs={{ swiper: thumbsSwiper }}>
            {testImgUrls.map((url, index) => (
              <SwiperSlide>
                <Box
                  key={index}
                  component="img"
                  src={url}
                >
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        

        {/* Thumbs Swiper -> store swiper instance */}
        {/* It is also required to set watchSlidesProgress prop */ }
        <Swiper
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={setThumbsSwiper}
        >
          {testImgUrls.map((url, index) => (
            <SwiperSlide>
              <Box
                key={index}
                component="img"
                src={url}
              >
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
  )
}