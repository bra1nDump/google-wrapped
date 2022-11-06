import { intersection, orderBy, sortBy, sortedIndexBy, zip } from "lodash";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { getBagOfWords, getSearches } from "./helpers";

export type Search = string;
export type Bag = [string, string[]];

export async function downloadBags() {
  const bagTopics = ["illnesses", "political", "sexual"];
  const bags = await Promise.all(bagTopics.map(getBagOfWords));
  const topicAndBagList = zip(bagTopics, bags) as Bag[];
  return topicAndBagList;
}

/**
 *
 * @param searches All searches for user
 * @param bags Pre fetched list of bags [topic, words associated with the topic]
 * @returns Similar to bags, [topic, user searches associated with the topic]
 */
export function findInteresting(
  searches: Search[],
  bags: Bag[]
): [string, string[]][] {
  return bags.map(([topic, bag]) => {
    return [topic, topNInterestingSearches(bag, 100, searches)];
  });
}

export function BaggyWords(props: { searches: Search[] }) {
  const [bags, setBags] = useState<Bag[]>();

  useEffect(() => {
    async function run() {
      setBags(await downloadBags());
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

// For separate parallel development, but also easy export into the main app
const debugElement = document.getElementById("baggie");

if (debugElement) {
  const root = createRoot(debugElement);
  root.render(<BaggyWords searches={getSearches()} />);
}
