import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./reset.css";

import { ignoreFeedback } from "./slowLearner";

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

// Uses TensorflowJs to get some 'interesting' searches and displays them.
// Used for testing purposes rn, ran on mobile but is prohibitivly slow
function MlApp() {
  const [topSexualSearches, setTopSexualSearches] = useState<string[]>();
  useEffect(() => {
    ignoreFeedback().then((searches) => {
      console.log(`topSexualSearches.length ${searches.length}`);
      setTopSexualSearches(searches);
    });
  }, []);

  return (
    <div>
      <h1>{topSexualSearches ? "loaded" : "Loading"}</h1>
      {(topSexualSearches ?? []).map((search) => (
        <div>{search}</div>
      ))}
      <motion.h1 animate={{ x: 30 }}>Hello World</motion.h1>
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
        <SwiperSlide>
          <div style={{ backgroundColor: "green" }}>Slide 1</div>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
      </Swiper>
    </div>
  );
}
