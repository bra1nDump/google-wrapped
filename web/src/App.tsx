import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";
import { start, Program, Cmd, Sub, cmdOf, cmdOfAsync } from "./platform";
import {
  ViewMemeTemplate,
  type Editor,
  type Filter,
  sampleBlueBookKirill,
} from "./MemeTemplate";
import { createRoot } from "react-dom/client";
import { ZipUpload } from "./ZipUpload";
import _ from "lodash";
import { Bag, downloadBags, findInteresting, Search } from "./BaggyWords";

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

type Model = {
  route: Route;
  bags: Bag[];
  searches: Array<string>;
  editors: Array<Editor>;
  activeEditor: number;
};

// In case we need this again
const kirillSampleSearches = [
  "can I call with a robot",
  "American hairless terrier adoption",
  "sleeping on a full stomach",
  "do mattress stores rolled up",
  "how to open beer with a spoon",
  "what time do squirrels go to sleep",
  "what can do if i find foreign object in food",
  "how do turtles reproductive organs",
  "pet smartness rank",
  "ingredients in soylent causing diarrhea",
  "together we will end homelessness",
  "most sketchy surveillance in usa",
  "nuclear.plant.meltdown recent",
  "how to take care of baby lizards",
  "use is cold as man painter",
  "swastika german",
  "how to remove all bots from instagram",
];

function init(): [Model, Array<Cmd<Msg>>] {
  return (
    // [ { route: MemeTemplate(BlueBookWTFMeme())
    [
      {
        route: Introduction(),
        bags: [],
        searches: [],
        editors: [sampleBlueBookKirill],
        activeEditor: 0,
      },
      [
        cmdOfAsync(async () => {
          const bags = await downloadBags();
          return { ctor: "UpdateBags", bags } as Msg;
        }),
      ],
    ]
  );
}

type Route = Introduction | SelectFilter | MemeTemplate | SearchPicker;
type Introduction = { ctor: "Introduction" };
function Introduction(): Route {
  return { ctor: "Introduction" };
}
type SelectFilter = { ctor: "SelectFilter"; centerStage: Filter };

function SelectFilter(): Route {
  return { ctor: "SelectFilter", centerStage: "TwoTruthsOneLieMeme" };
}
type MemeTemplate = { ctor: "MemeTemplate"; meme: Filter; searches: string[] };
function MemeTemplate(meme: Filter, searches: Search[]): Route {
  return { ctor: "MemeTemplate", meme, searches };
}

type SearchPicker = { ctor: "SearchPicker"; slotIndex: number };

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
        applyMsg({ ctor: "UpdateSearches", searches });
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "1em",
      }}
    >
      <span style={{ marginBottom: "1em" }}>Compliance brings reward</span>

      <span style={{ marginBottom: "1em" }}>
        You <strong>will</strong> comply
      </span>
      <motion.span
        animate={{ y: 300 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <button
          onClick={function () {
            applyMsg(ChangeScreen(SelectFilter()));
          }}
        >
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

function ViewSearchPicker(props: {
  onPick: (search: string) => void;
  searches: string[];
}) {
  return (
    <ul>
      {...props.searches.map((search) => {
        const truncatedSearch = search.slice(0, 30);
        return (
          <li
            onClick={() => {
              props.onPick(search);
            }}
          >
            {truncatedSearch}
          </li>
        );
      })}
    </ul>
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
      page = (
        <ViewMemeTemplate
          editor={model.editors[0]}
          searches={model.route.searches}
          pickerForSlot={(slot: number) => {
            applyMsg({ ctor: "OpenPicker", holeIndex: slot });
          }}
        />
      );
      break;
    case "SearchPicker":
      const slotIndex = model.route.slotIndex;
      page = (
        <ViewSearchPicker
          onPick={(search: string) => {
            applyMsg({
              ctor: "UpdateHole",
              holeIndex: slotIndex,
              text: search,
            });
          }}
          searches={model.searches}
        />
      );
      break;
  }
  return <PhoneFrame>{page}</PhoneFrame>;
}

function viewSelectFilter() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "100px 1fr min-content",
        height: "100%",
        width: "420px",
      }}
    >
      <span>
        Select Filter
        <button
          onClick={function () {
            applyMsg(ChangeScreen(Introduction()));
          }}
          value={"foo"}
        >
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
        style={{ width: "100%" }}
        //scrollbar={{ draggable: true }}
        //pagination={{ clickable: true }}
        onActiveIndexChange={(e) => console.log(e.activeIndex)}
      >
        <SwiperSlide style={{ backgroundColor: "lightgrey" }}>
          Slide 1
        </SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightgreen" }}>
          Slide 2
        </SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightpink" }}>
          Slide 3
        </SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightblue" }}>
          Slide 4
        </SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightsalmon" }}>
          Slide 5
        </SwiperSlide>
      </Swiper>
      <div style={{ backgroundColor: "blue", paddingBottom: "1em" }}>
        <button>Select Filter</button>
      </div>
    </div>
  );
}

function viewMemePicker() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "100px 1fr min-content",
        height: "100%",
        width: "420px",
      }}
    >
      <span>
        Select Filter
        <button
          onClick={function () {
            applyMsg(ChangeScreen(Introduction()));
          }}
          value={"foo"}
        >
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
        style={{ width: "100%" }}
        //scrollbar={{ draggable: true }}
        //pagination={{ clickable: true }}
        onActiveIndexChange={(e) => console.log(e.activeIndex)}
      >
        <SwiperSlide style={{ backgroundColor: "lightgrey" }}>Meme</SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightgreen" }}>
          Picker
        </SwiperSlide>
        <SwiperSlide style={{ backgroundColor: "lightpink" }}>
          Rejects
        </SwiperSlide>
      </Swiper>
      <div style={{ backgroundColor: "blue", paddingBottom: "1em" }}>
        <button>Select Filter</button>
      </div>
    </div>
  );
}

// UPDATE

type Msg =
  | NoOp
  | ChangeScreen
  | { ctor: "UpdateBags"; bags: Bag[] }
  | { ctor: "UpdateSearches"; searches: string[] }
  | { ctor: "OpenPicker"; holeIndex: number }
  | { ctor: "UpdateHole"; holeIndex: number; text: string };

type NoOp = { ctor: "NoOp" };
function NoOp(): Msg {
  return { ctor: "NoOp" };
}
type ChangeScreen = { ctor: "ChangeScreen"; route: Route };
function ChangeScreen(route: Route): Msg {
  return { ctor: "ChangeScreen", route };
}

function arrayUpdate<T>(index: number, array: T[], update: (_: T) => T): T[] {
  if (!(index in array)) {
    return array;
  }
  const arrayCopy = [...array];
  arrayCopy[index] = update(array[index]);
  return arrayCopy;
}

function update(msg: Msg, model: Model): [Model, Array<Cmd<Msg>>] {
  var newModel;
  switch (msg.ctor) {
    case "NoOp":
      return [model, []];
    case "ChangeScreen":
      newModel = Object.assign({}, model, { route: msg.route });
      return [newModel, []];
    case "UpdateBags":
      return [_.assign(model, { bags: msg.bags }), []];
    case "UpdateSearches":
      const searchesOfAcceptableLength = msg.searches.filter(
        (s) => s.length < 40
      );
      // WARNING: This assumes we have fetched all bags
      if (!model.bags) {
        window.alert(
          "Language model did not have enough time to download from our servers"
        );
      }
      const interestingSearches = findInteresting(
        searchesOfAcceptableLength,
        model.bags
      );
      const interestingSearchesFlat = interestingSearches.flatMap(
        ([_, searches]) => searches
      );
      return [
        _.assign(model, { searches: interestingSearchesFlat }),
        [
          cmdOf(
            ChangeScreen(
              MemeTemplate("BlueBookWTFMeme", interestingSearchesFlat)
            )
          ),
        ],
      ];
    case "OpenPicker":
      newModel = Object.assign({}, model, {
        route: { ctor: "SearchPicker", slotIndex: msg.holeIndex } as Route,
      });
      return [newModel, []];
    case "UpdateHole":
      newModel = _.assign(model, {
        route: MemeTemplate("BlueBookWTFMeme", model.searches),
        editors: arrayUpdate(model.activeEditor, model.editors, (editor) => {
          return _.assign(editor, {
            slots: arrayUpdate(msg.holeIndex, editor.slots, (_) => msg.text),
          });
        }),
      });

      return [newModel, []];
  }
}

// SUBSCRIPTIONS

function subscriptions(model: Model): Array<Sub<Msg>> {
  return [];
}
