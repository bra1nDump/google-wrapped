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
    init: initTestStories,
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

function initTestStories(): [Model, Array<Cmd<Msg>>] {
  return [
    {
      route: { ctor: "Stories" },
      bags: [],
      searches: ["lol", "lil"],
      editors: [sampleBlueBookKirill, { ...sampleBlueBookKirill }],
      activeEditor: 0,
    },
    [
      cmdOfAsync(async () => {
        const bags = await downloadBags();
        return { ctor: "UpdateBags", bags } as Msg;
      }),
    ],
  ];
}

function init(): [Model, Array<Cmd<Msg>>] {
  return [
    {
      route: { ctor: "Introduction" },
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
  ];
}

type Route =
  | { ctor: "Introduction" }
  | { ctor: "Stories" }
  | { ctor: "SearchPicker"; slotIndex: number };

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

  function Router(model: Model) {
    switch (model.route.ctor) {
      case "Introduction":
        return ViewIntroduction();
      case "Stories":
        return (
          <StoriesEditor editors={model.editors} searches={model.searches} />
        );
      case "SearchPicker":
        const slotIndex = model.route.slotIndex;
        return (
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
    }
  }

  return <PhoneFrame>{Router(model)}</PhoneFrame>;
}

function StoriesEditor(props: { editors: Editor[]; searches: Search[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "100% 1fr min-content",
        height: "100%",
        width: "100%",
      }}
    >
      <Swiper
        effect={"coverflow"}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        //onSwiper={(s) => (window.swiper = s)}
        slidesPerView={1}
        //spaceBetween={50}
        //navigation
        loop
        touchStartPreventDefault={false}
        style={{ width: "100%", height: "100%" }}
        //scrollbar={{ draggable: true }}
        //pagination={{ clickable: true }}
        onActiveIndexChange={(e) => console.log(e.activeIndex)}
      >
        {...props.editors.map((editor) => {
          return (
            <SwiperSlide style={{ backgroundColor: "lightgrey" }}>
              <ViewMemeTemplate
                editor={editor}
                pickerForSlot={(slot: number) => {
                  applyMsg({ ctor: "OpenPicker", holeIndex: slot });
                }}
                searches={props.searches}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
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
  | ChangeScreen
  | { ctor: "UpdateBags"; bags: Bag[] }
  | { ctor: "UpdateSearches"; searches: string[] }
  | { ctor: "OpenPicker"; holeIndex: number }
  | { ctor: "UpdateHole"; holeIndex: number; text: string };

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
        [cmdOf(ChangeScreen({ ctor: "Stories" }))],
      ];
    case "OpenPicker":
      newModel = Object.assign({}, model, {
        route: { ctor: "SearchPicker", slotIndex: msg.holeIndex } as Route,
      });
      return [newModel, []];
    case "UpdateHole":
      newModel = _.assign(model, {
        editors: arrayUpdate(model.activeEditor, model.editors, (editor) => {
          return _.assign(editor, {
            slots: arrayUpdate(msg.holeIndex, editor.slots, (_) => msg.text),
          });
        }),
      });

      return [
        newModel,
        [cmdOf({ ctor: "ChangeScreen", route: { ctor: "Stories" } } as Msg)],
      ];
  }
}

// SUBSCRIPTIONS

function subscriptions(model: Model): Array<Sub<Msg>> {
  return [];
}
