import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";
import { start, Program, Cmd, Sub } from "./platform";
import { ViewMemeTemplate } from "./MemeTemplate";
import { createRoot } from "react-dom/client";
import { ZipUpload } from "./ZipUpload";

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

type Model =
    { route: Route
    , searches: Array<string>
    , editors: Array<Editor>
    , activeEditor: number
    }

type Editor = { filter: Filter, slots: string[] } ;
type Url = string

type OtherFilter = {};

function init(): [Model, Array<Cmd<Msg>>] {
    return (
        // [ { route: MemeTemplate(BlueBookWTFMeme())
        [ { route: Introduction()
          , searches:
            [ "can I call with a robot"
            , "American hairless terrier adoption"
            , "sleeping on a full stomach"
            , "do mattress stores rolled up"
            , "how to open beer with a spoon"
            , "what time do squirrels go to sleep"
            , "what can do if i find foreign object in food"
            , "how do turtles reproductive organs"
            , "pet smartness rank"
            , "ingredients in soylent causing diarrhea"
            , "together we will end homelessness"
            , "most sketchy surveillance in usa"
            , "nuclear.plant.meltdown recent"
            , "how to take care of baby lizards"
            , "use is cold as man painter"
            , "swastika german"
            , "how to remove all bots from instagram"
            ]
          , editors: []
          , activeEditor: -1,
          }
        , []
        ]
    );
}

type Route
    = Introduction
    | SelectFilter
    | MemeTemplate;
    ;

type Introduction = { ctor: "Introduction" }
function Introduction(): Route { return { ctor: "Introduction" } }
type SelectFilter =
    { ctor: "SelectFilter"
    , centerStage : Filter
    }

function SelectFilter(): Route {
  return { ctor: "SelectFilter", centerStage: "TwoTruthsOneLieMeme" };
}
type MemeTemplate = { ctor: "MemeTemplate"; meme: Filter };
function MemeTemplate(searches: string[], meme: Filter): Route {
  return { ctor: "MemeTemplate", meme };
}

type Filter =
  | "TwoTruthsOneLieMeme"
  | "UncoverGhostMeme"
  | "TypesOfHeadacheMeme"
  | "GalaxyBrainMeme"
  | "SpongeBobPaysUpMeme"
  | "BlueBookWTFMeme"
  | "FuckedUpMeme"
  | "JerryNewspaperMeme"
  ;

// An easy way to avoid this boilerplate is to create a generic meme datastruture
// { imgSrc, name, relativeBoundingBoxesForText: [int, int, int, int][] }

// VIEW


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

    // that I have missed this trick so much
    <ZipUpload
      nextStage={(searches: string[]) => {
        applyMsg(ChangeScreen(MemeTemplate(searches, "BlueBookWTFMeme")));
      }}
    />,
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
    </div>
  );
}

function ViewIntroScreen() {
    return (
        <div style={{ display: "flex", justifyContent:"center", flexDirection: "column", textAlign: "center", padding: "1em"}}>
            <span style={{marginBottom: "1em"}}>
                Compliance brings reward
            </span>
            
            <span style={{marginBottom: "1em"}}>
                You <strong>will</strong> comply
            </span>
            <motion.span
            animate={{y:300}}
            transition={{type: "spring", duration: 1}}
            >
                <button onClick={function() {
                    applyMsg(ChangeScreen(SelectFilter()))
                } }>
                    I will comply
                </button>
            </motion.span>
        </div>
    );
}


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

function viewSelectFilter() {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "100px 1fr min-content",
            height: "100%",
            width: "420px",

        }}>
            <span>
                Select Filter
                <button onClick={function() { applyMsg(ChangeScreen(Introduction())) }} value={"foo"}>
                    Go to intro
            </button>
            </span>
                <Swiper
                    effect={"coverflow"}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    //onSwiper={(s) => (window.swiper = s)}
                    slidesPerView={1}
                    //spaceBetween={50}
                    //navigation
                    loop
                    style={{width: "100%"}}
                    //scrollbar={{ draggable: true }}
                    //pagination={{ clickable: true }}
                    onActiveIndexChange={(e) => console.log(e.activeIndex) }
                  >
                    <SwiperSlide style={{backgroundColor: "lightgrey"}}>
                        Slide 1
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightgreen"}}>
                        Slide 2
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightpink"}}>
                        Slide 3
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightblue"}}>
                        Slide 4
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightsalmon"}}>
                        Slide 5
                    </SwiperSlide>
                </Swiper>
            <div style={
                { backgroundColor: "blue"
                , paddingBottom: "1em"
                }
            }>
                <button>
                    Select Filter
                </button>
            </div>
        </div>
    );
}

function viewMemePicker() {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "100px 1fr min-content",
            height: "100%",
            width: "420px",

        }}>
            <span>
                Select Filter
                <button onClick={function() { applyMsg(ChangeScreen(Introduction())) }} value={"foo"}>
                    Go to intro
            </button>
            </span>
                <Swiper
                    effect={"coverflow"}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    //onSwiper={(s) => (window.swiper = s)}
                    slidesPerView={1}
                    //spaceBetween={50}
                    //navigation
                    style={{width: "100%"}}
                    //scrollbar={{ draggable: true }}
                    //pagination={{ clickable: true }}
                    onActiveIndexChange={(e) => console.log(e.activeIndex) }
                  >
                    <SwiperSlide style={{backgroundColor: "lightgrey"}}>
                        Meme
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightgreen"}}>
                        Picker
                    </SwiperSlide>
                    <SwiperSlide style={{backgroundColor: "lightpink"}}>
                        Rejects
                    </SwiperSlide>
                </Swiper>
            <div style={
                { backgroundColor: "blue"
                , paddingBottom: "1em"
                }
            }>
                <button>
                    Select Filter
                </button>
            </div>
        </div>
    );
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
