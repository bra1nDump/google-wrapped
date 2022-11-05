import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";
import { start, Program, Cmd, Sub } from "./platform";
import { ViewMemeTemplate } from "./MemeTemplate";
import { createRoot } from "react-dom/client";

//  MAIN

function main(): Program<Model, Msg> {
  const rootContainer = document.getElementById("app")!;
  return start({
    init: init,
    view: App,
    update: update,
    subscriptions: subscriptions,
    rootContainer: rootContainer,
  });
}

let { applyMsg } = main();

// Playground when our platform breaks lol
// const rootContainer = document.getElementById("app")!;
// const ruled = createRoot(rootContainer);
// ruled.render(<ViewMemeTemplate />);

// MODEL

type Model = { route: Route };

function init(): [Model, Array<Cmd<Msg>>] {
  return [{ route: Introduction() }, []];
  return [{ route: MemeTemplate(BlueBookWTFMeme()) }, []];
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

// An easy way to avoid this boilerplate is to create a generic meme datastruture
// { imgSrc, name, relativeBoundingBoxesForText: [int, int, int, int][] }
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

function ViewIntroduction() {
  const takeOutSteps = [
    <span>
      Go to
      <a
        href="https://takeout.google.com/settings/takeout/downloads"
        target="_blank"
      >
        Google Takeout 🥡
      </a>
    </span>,
    'Click "Deselect all"',
    'Find and set a checkmark under "My Activity" 🏄',
    'Click "Next step" on the bottom',
    'Keep the fields in the next step as is and click "Create export"',
    "Wait for the email from google (2 minutes) 📥",
    "Click the link from the email, it will open in google drive 🔗",
    "Download your Takeout folder 📁",
    "Return to the website ENABLE AIRPLANE MODE and upload .zip",

    <div
      style={{
        padding: "12px",
        backgroundColor: "#eee",
        borderRadius: "12px",
      }}
    >
      <input
        name="file"
        type="file"
        style={{
          padding: "1%",
          backgroundColor: "#eee",
          border: "2px solid #ccc",
          borderRadius: "8px",
          borderStyle: "dashed",
          color: "#000",
          fontWeight: "700",
        }}
      />
    </div>,
    "Get your search statistics and make means with your search queries",
  ];

  return (
    <div>
      <h2>Pro tip 🐻: can be done entirely from mobile!</h2>
      <ul
        style={{
          textAlign: "left",
          overflowWrap: "break-word",
        }}
      >
        {...takeOutSteps.map((x) => <li>{x}</li>)}
      </ul>
      <button
        onClick={function () {
          applyMsg(ChangeScreen(SelectFilter()));
        }}
      >
        Go to picker
      </button>
      <button
        onClick={function () {
          applyMsg(ChangeScreen(MemeTemplate(BlueBookWTFMeme())));
        }}
      >
        Open Meme template for BlueBookWTFMeme
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {props.children}
    </div>
  );
}

function ViewSelectFilter() {
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

function App(model: Model) {
  console.log("got model", model);
  let page: React.ReactElement;
  switch (model.route.ctor) {
    case "Introduction":
      page = ViewIntroduction();
      break;
    case "SelectFilter":
      page = ViewSelectFilter();
      break;
    case "MemeTemplate":
      page = <ViewMemeTemplate />;
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
