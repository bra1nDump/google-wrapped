import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";
import { start, Program, Cmd, Sub } from "./platform";

import { ignoreFeedback } from "./tensorFlowToxicity";

//  MAIN

function main(): Program<Model, Msg> {
  const rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
  return start({
    init: init,
    view: App,
    update: update,
    subscriptions: subscriptions,
    rootContainer: rootContainer,
  });
}

let { applyMsg } = main();

// MODEL

type Model = { route: Route };

function init(): [Model, Array<Cmd<Msg>>] {
  return [{ route: Introduction() }, []];
}

type Route = Introduction | SelectFilter | MemeTemplate;

type Introduction = { ctor: "Introduction" };
function Introduction(): Route {
  return { ctor: "Introduction" };
}
type SelectFilter = { ctor: "SelectFilter"; centerStage: Filter };
function SelectFilter(): Route {
  return { ctor: "SelectFilter", centerStage: { ctor: "TwoTruthsOneLieMeme" } };
}
type MemeTemplate = { ctor: "MemeTemplate"; meme: Filter };
function MemeTemplate(meme: Filter): Route {
  return { ctor: "MemeTemplate", meme };
}

type Filter =
  | TwoTruthsOneLieMeme
  | UncoverGhostMeme
  | TypesOfHeadacheMeme
  | GalaxyBrainMeme
  | SpongeBobPaysUpMeme
  | BlueBookWTFMeme
  | FuckedUpMeme
  | JerryNewspaperMeme;

type TwoTruthsOneLieMeme = { ctor: "TwoTruthsOneLieMeme" };
function TwoTruthsOneLieMeme(): Filter {
  return { ctor: "TwoTruthsOneLieMeme" };
}

type UncoverGhostMeme = { ctor: "UncoverGhostMeme" };
function UncoverGhostMeme(): Filter {
  return { ctor: "UncoverGhostMeme" };
}

type TypesOfHeadacheMeme = { ctor: "TypesOfHeadacheMeme" };
function TypesOfHeadacheMeme(): Filter {
  return { ctor: "TypesOfHeadacheMeme" };
}

type GalaxyBrainMeme = { ctor: "GalaxyBrainMeme" };
function GalaxyBrainMeme(): Filter {
  return { ctor: "GalaxyBrainMeme" };
}

type SpongeBobPaysUpMeme = { ctor: "SpongeBobPaysUpMeme" };
function SpongeBobPaysUpMeme(): Filter {
  return { ctor: "SpongeBobPaysUpMeme" };
}

type BlueBookWTFMeme = { ctor: "BlueBookWTFMeme" };
function BlueBookWTFMeme(): Filter {
  return { ctor: "BlueBookWTFMeme" };
}

type FuckedUpMeme = { ctor: "FuckedUpMeme" };
function FuckedUpMeme(): Filter {
  return { ctor: "FuckedUpMeme" };
}

type JerryNewspaperMeme = { ctor: "JerryNewspaperMeme" };
function JerryNewspaperMeme(): Filter {
  return { ctor: "JerryNewspaperMeme" };
}

// VIEW

//            <motion.h1
//            animate={{x:300}}
//            >
//            Hello World
//            </motion.h1>

function viewIntroScreen() {
  return (
    <div>
      Intro screen
      <button
        onClick={function () {
          applyMsg(ChangeScreen(SelectFilter()));
        }}
      >
        Go to picker
      </button>
      <button
        onClick={function () {
          applyMsg(ChangeScreen(MemeTemplate(JerryNewspaperMeme())));
        }}
      >
        Open Meme template for ...
      </button>
    </div>
  );
}

//            <Swiper
//                modules={[Navigation, Pagination, Scrollbar, A11y]}
//                onSwiper={(s) => (window.swiper = s)}
//                slidesPerView={1}
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
        onClick={(event) => applyMsg(NoOp())}
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

function viewSelectFilter() {
  return (
    <div>
      Select Filter
      <button
        onClick={function () {
          applyMsg(ChangeScreen(Introduction()));
        }}
        value={"foo"}
      >
        Go to intro
      </button>
    </div>
  );
}

function viewMemeTemplate(meme: Filter) {
  return <div>Meeeeemeee</div>;
}

function App(model: Model) {
  console.log("got model", model);
  let page: React.ReactElement;
  switch (model.route.ctor) {
    case "Introduction":
      page = viewIntroScreen();
      break;
    case "SelectFilter":
      page = viewSelectFilter();
      break;
    case "MemeTemplate":
      page = viewMemeTemplate(model.route.meme);
      break;
  }
  return <PhoneFrame>{page}</PhoneFrame>;
}

// UPDATE

type Msg = NoOp | ChangeScreen;

type NoOp = { ctor: "NoOp" };
function NoOp(): Msg {
  return { ctor: "NoOp" };
}
type ChangeScreen = { ctor: "ChangeScreen"; route: Route };
function ChangeScreen(route: Route): Msg {
  return { ctor: "ChangeScreen", route };
}

function update(msg: Msg, model: Model): [Model, Array<Cmd<Msg>>] {
  switch (msg.ctor) {
    case "NoOp":
      return [model, []];
    case "ChangeScreen":
      const newModel = Object.assign({}, model, { route: msg.route });
      return [newModel, []];
  }
}

// SUBSCRIPTIONS

function subscriptions(model: Model): Array<Sub<Msg>> {
  return [];
}
