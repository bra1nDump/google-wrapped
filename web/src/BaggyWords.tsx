import { intersection, orderBy, sortBy, sortedIndexBy, zip } from "lodash";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { getBagOfWords, getSearches } from "./helpers";

type Search = string;
type Bag = [string, string[]];

export function BaggyWords(props: { searches: Search[] }) {
  const bagTopics = ["illnesses", "political", "sexual"];
  const [bags, setBags] = useState<Bag[]>();

  useEffect(() => {
    async function run() {
      const bags = await Promise.all(bagTopics.map(getBagOfWords));
      const topicAndBagList = zip(bagTopics, bags) as Bag[];
      setBags(topicAndBagList);
    }
    run();
  }, []);

  return (
    <div>
      {bags && bags.map((bag) => <Topic bag={bag} searches={props.searches} />)}
    </div>
  );
}

function Topic(props: { bag: Bag; searches: Search[] }) {
  const [topic, words] = props.bag;

  const topSearches = topNInterestingSearches(words, 100, props.searches);

  return (
    <div>
      <h1>{topic}</h1>
      <h2>Words:</h2>
      {...words.slice(0, 10).map((x) => <div>{x}</div>)}
      <h2>Searches:</h2>
      {...topSearches.map((x) => <div>{x}</div>)}
    </div>
  );
}

function topNInterestingSearches(
  interestingWords: string[],
  n: number,
  searches: Search[]
): Search[] {
  // [score, search][]
  const scoredSearches: [number, string][] = searches.map((search) => {
    const normalizedSearchWords = new String(search)
      .toLowerCase()
      .replace(/[^0-9a-z ]/gi, "")
      .split(" ");

    const overlap = intersection(interestingWords, normalizedSearchWords);
    return [overlap.length, search];
  });

  const searchesSorted = orderBy(
    scoredSearches,
    [([score, _]) => score],
    ["desc"]
  ).slice(0, n);

  return searchesSorted.map(([_, search]) => search);
}

import { useRef } from "react";
import { ZipReader, BlobReader, TextWriter } from "@zip.js/zip.js";
export function ZipUpload() {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div>
        <input
          height={100}
          width={100}
          id="file-input"
          ref={fileInput}
          type="file"
          accept=".zip"
          onInput={async (event) => {
            console.log(`onInput: ${event}`);
            const file = fileInput.current?.files?.[0];
            if (!file) {
              return;
            }

            const zipReader = new ZipReader(new BlobReader(file));
            const zipEntries = await zipReader.getEntries();

            // TODO Account for html upload, for this to be json they need to clock an additional button
            const searchEntry = zipEntries.find(
              (x) => x.filename === "Takeout/My Activity/Search/MyActivity.json"
            );

            if (!searchEntry) {
              window.alert(
                "Search activity not found in the .zip file, are you sure you fold instructions correctly?"
              );
              return;
            }

            const searchEntryData = await searchEntry.getData(new TextWriter());
            const json = JSON.parse(searchEntryData);
            const searches = getSearches(json);

            searches.slice(0, 10).map(console.log);
          }}
        ></input>
      </div>
    </div>
  );
}
// For separate parallel development, but also easy export into the main app
const debugElement = document.getElementById("baggie");

if (debugElement) {
  const root = createRoot(debugElement);
  // root.render(<BaggyWords searches={getSearches()} />, debugElement);
  root.render(<ZipUpload />);
}
