import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./static/reset.css";
import "./static/app.css";
import { start, Program, Cmd, Sub, cmdOf, cmdOfAsync } from "./platform";
import {
  ViewMemeTemplate,
  type Editor,
  type Filter,
  sampleBlueBookKirill,
  emptyBlueBookEditor,
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

function initTestStories(): [Model, Array<Cmd<Msg>>] {
  return [
    {
      route: { ctor: "Stories" },
      bags: [],
      searches: ["lol", "lil"],
      editors: [emptyBlueBookEditor],
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

function ViewStep(props: any) {
  const [done, setDone] = useState(false);
  let icon;
  let backgroundColor;
  let border;
  if (done) {
    backgroundColor = "#d8ffe4";
    border = "2px solid #10b981";

    icon = (
      <svg
        style={{ flex: "0 0 auto", marginRight: "8px" }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.25 12.25L10.25 15.25L16.75 8.75"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="10.25" stroke="black" strokeWidth="1.5" />
      </svg>
    );
  } else {
    backgroundColor = "";
    border = "2px solid #e5e5e5";

    icon = (
      <svg
        style={{ flex: "0 0 auto", marginRight: "8px" }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10.25" stroke="black" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <li
      style={{
        display: "flex",
        padding: "12px",
        margin: "12px 0",
        borderRadius: "6px",
        backgroundColor,
        border,
      }}
      onClick={() => setDone(!done)}
    >
      {icon}
      {props.children}
    </li>
  );
}

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
    'Click "Create new export" then "Deselect all"',
    'Select "My Activity" 🏄, right after Google Maps',
    'Click "Multiple formats" and change "HTML" to "JSON" in a drop down',
    'Click "Next step" on the bottom',
    'Click "Create export"',
    "Wait for the email from google (2 minutes) 📥",
    "Click the link from the email 🔗 and download the file",
    "Return to the website ENABLE AIRPLANE MODE and upload .zip",
  ];

  return (
    <div>
      <div id="about">
        <h2 id="title">Analyze your Google search history</h2>
        <div className="subtitle">
          <div className="benefit-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              style={{ fill: "#fff", paddingRight: "8px" }}
            >
              <path
                fill="context-fill"
                d="M12.408 11.992c-1.663 0-2.813-2-4.408-2s-2.844 2-4.408 2C1.54 11.992.025 10.048 0 6.719c-.015-2.068.6-2.727 3.265-2.727S6.709 5.082 8 5.082s2.071-1.091 4.735-1.091 3.28.66 3.265 2.727c-.025 3.33-1.54 5.274-3.592 5.274zM4.572 6.537c-1.619.07-2.286 1.035-2.286 1.273s1.073.909 2.122.909 2.286-.384 2.286-.727a1.9 1.9 0 0 0-2.122-1.455zm6.857 0a1.9 1.9 0 0 0-2.123 1.455c0 .343 1.236.727 2.286.727s2.122-.671 2.122-.909-.667-1.203-2.286-1.273z"
              ></path>
            </svg>
            Privacy
          </div>
          <span>
            The analysis does all the work locally on your device!{" "}
            <b>Works in airplane mode!</b> No data leaves your device over the
            network.
          </span>
        </div>
      </div>
      <section style={{ padding: "0 12px" }}>
        <h2 id="show-mobile-tip">
          Pro tip 🐻: can be done entirely from mobile!
        </h2>
        <ul
          style={{
            textAlign: "left",
            overflowWrap: "break-word",
            listStyle: "none",
            padding: "0",
          }}
        >
          {...takeOutSteps.map((x) => {
            return <ViewStep>{x}</ViewStep>;
          })}
        </ul>
        <ZipUpload
          nextStage={(searches: string[]) => {
            applyMsg({ ctor: "UpdateSearches", searches });
          }}
        />
        <div
          style={{
            display: "flex",
            padding: "12px",
            margin: "12px 0",
            borderRadius: "6px",
            border: "2px solid #e5e5e5",
          }}
          //onClick={() => setDone(!done)}
        >
          Get your search statistics and create memes with your search queries"
        </div>
      </section>
    </div>
  );
}

//<button onClick={function() {
//    applyMsg(ChangeScreen(SelectFilter()))
//} }>

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
          <StoriesEditor
            editors={model.editors}
            activeEditor={model.activeEditor}
            searches={model.searches}
          />
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
  return (
    <div id="app-frame">
      <div id="phone-frame" className="scroll">
        {Router(model)}
      </div>
    </div>
  );
}

function StoriesEditor(props: {
  editors: Editor[];
  activeEditor: number;
  searches: Search[];
}) {
  return (
    <div>
      <h4 style={{}}>
        The template was initialized with some of your searches. Click text to
        change
      </h4>
      <ViewMemeTemplate
        editor={props.editors[0]}
        pickerForSlot={(slot: number) => {
          applyMsg({ ctor: "OpenPicker", holeIndex: slot });
        }}
        searches={props.searches}
      />
    </div>
  );
  // TODO: Fix layout for Swiper, we only have one meme working so fuck it
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
        modules={[Navigation, Pagination, Scrollbar]}
        //onSwiper={(s) => (window.swiper = s)}
        slidesPerView={1}
        //spaceBetween={50}
        //navigation
        loop
        allowTouchMove={false}
        touchStartPreventDefault={false}
        style={{ width: "100%", height: "100%" }}
        //scrollbar={{ draggable: true }}
        //pagination={{ clickable: true }}
        initialSlide={props.activeEditor}
        onRealIndexChange={(e) => {
          applyMsg({ ctor: "UpdateActiveEditor", activeEditor: e.realIndex });
        }}
      >
        {...props.editors.map((editor, index) => {
          return (
            <SwiperSlide style={{ backgroundColor: "lightgrey" }}>
              <button onClick={(e) => console.log("aaaa")}>Click m!</button>
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

// UPDATE

type Msg =
  | ChangeScreen
  | { ctor: "UpdateBags"; bags: Bag[] }
  | { ctor: "UpdateSearches"; searches: string[] }
  | { ctor: "UpdateActiveEditor"; activeEditor: number }
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

      // TODO: expecting 4 slots and single editor
      const slots = _.shuffle(interestingSearchesFlat).slice(0, 4);

      return [
        _.assign(model, {
          searches: interestingSearchesFlat,
          editors: [{ filter: "BlueBookWTFMeme", slots }],
        } as Model),
        [cmdOf(ChangeScreen({ ctor: "Stories" }))],
      ];
    case "UpdateActiveEditor":
      return [_.assign(model, { activeEditor: msg.activeEditor }), []];
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
