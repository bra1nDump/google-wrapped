import React from "react";
import ReactDOM from "react-dom";
import {motion} from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

var swiper;

function App() {
    return (
        <div>
            <motion.h1
            animate={{x:300}}
            >
            Hello World
            </motion.h1>
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            onSwiper={(s) => (window.swiper = s)}
            slidesPerView={3}
            spaceBetween={50}
            navigation
            loop
            scrollbar={{ draggable: true }}
            pagination={{ clickable: true }}
          >
            <SwiperSlide><div style={{backgroundColor: "green"}}>Slide 1</div></SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
          </Swiper>
        </div>
    ); 
}

ReactDOM.render(<App/>, document.getElementById("app"))
