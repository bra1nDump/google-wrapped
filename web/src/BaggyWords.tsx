import { intersection, orderBy, sortBy, sortedIndexBy, zip } from "lodash";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  ActivityEntry,
  getBagOfWords,
  getSearches,
  parseActivity,
  Search,
} from "./helpers";

export type Bag = [string, string[]];

export type Theme = {
  // For example "political" from a bag of words or "late" for searches outside your normal time
  name: string;
  searches: Search[];
};

export type SearchInsights = {
  totalSearches: number;
  totalWebsiteVisits: number;
  firstSearchDate: Date;
  themes: Theme[]; // Sorted by relevance, most relevant first
};

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
 * @returns High level insights on your searches
 */
export function getInsights(searches: Search[], bags: Bag[]): SearchInsights {
  const searchesByTopic = bags.map(([topic, bag]) => {
    return { name: topic, searches: searchesMatchingTopic(bag, searches) };
  });

  return {
    totalSearches: searches.length,
    totalWebsiteVisits: 0,
    firstSearchDate: new Date(),
    themes: searchesByTopic,
  };
}

export function BaggyWords(props: { searches: ActivityEntry[] }) {
  const [bags, setBags] = useState<Bag[]>();

  const searches = getSearches(props.searches);

  useEffect(() => {
    async function run() {
      setBags(await downloadBags());
    }
    run();
  }, []);

  return (
    <div>
      {bags && bags.map((bag) => <Topic bag={bag} searches={searches} />)}
    </div>
  );
}

function Topic(props: { bag: Bag; searches: Search[] }) {
  const [topic, words] = props.bag;

  const topSearches = searchesMatchingTopic(words, props.searches);

  return (
    <div>
      <h1>{topic}</h1>
      <h2>Words:</h2>
      {...words.slice(0, 10).map((x) => <div>{x}</div>)}
      <h2>Searches:</h2>
      {...topSearches.map((x) => <div>{x.query}</div>)}
    </div>
  );
}

/**
 * Removes all searches that have no overlap with topic words.
 * @param topicWords If any of these words are seen in a search it's considered as belonging to the topic
 * @param searches Searches to try classifying
 * @returns List of searches ordered by topic relevance, most relevant first
 */
function searchesMatchingTopic(
  topicWords: string[],
  searches: Search[]
): Search[] {
  // [score, search][]
  const scoredSearches: [number, Search][] = searches.map((search) => {
    const normalizedSearchWords = new String(search.query)
      .toLowerCase()
      .replace(/[^0-9a-z ]/gi, "")
      .split(" ");

    const overlap = intersection(topicWords, normalizedSearchWords);
    return [overlap.length, search];
  });

  const searchesSorted = orderBy(
    scoredSearches,
    [([score, _]) => score],
    ["desc"]
  ).filter(([score, _]) => score > 0);

  return searchesSorted.map(([_, search]) => search);
}

// For separate parallel development, but also easy export into the main app
const debugElement = document.getElementById("baggie");

if (debugElement) {
  const root = createRoot(debugElement);
  root.render(<BaggyWords searches={parseActivity([])} />);
}
