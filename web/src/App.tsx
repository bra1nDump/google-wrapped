import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";

import { ignoreFeedback } from "./tensorFlowToxicity";

var swiper;

//            <motion.h1
//            animate={{x:300}}
//            >
//            Hello World
//            </motion.h1>

function IntroScreen() {
  return <div>Intro screen</div>;
}

//            <Swiper
//                modules={[Navigation, Pagination, Scrollbar, A11y]}
//                onSwiper={(s) => (window.swiper = s)}
//                slidesPerView={3}
//                spaceBetween={50}
//                navigation
//                loop
//                scrollbar={{ draggable: true }}
//                pagination={{ clickable: true }}
//              >
//                <SwiperSlide><div style={{backgroundColor: "green"}}>Slide 1</div></SwiperSlide>
//                <SwiperSlide>Slide 2</SwiperSlide>
//                <SwiperSlide>Slide 3</SwiperSlide>
//                <SwiperSlide>Slide 4</SwiperSlide>
//                <SwiperSlide>Slide 5</SwiperSlide>
//              </Swiper>
function PhoneFrame(props: { children: React.ReactNode }) {
  return (
    <div
      id="foo"
      style={{
        backgroundColor: "#e5e5e5",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        id="bar"
        style={{
          border: "1px solid #000",
          backgroundColor: "#fff",
          width: "420px",
          height: "800px",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

function App() {
  return (
    <PhoneFrame>
      <IntroScreen />
    </PhoneFrame>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
