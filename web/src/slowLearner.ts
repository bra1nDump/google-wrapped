import * as toxicity from "@tensorflow-models/toxicity";
import * as _ from "lodash";

import { activity } from "./kirill-activity";

type ActivityEntry = {
  title: string;
};

function getSearches() {
  const typedActivity: ActivityEntry[] = activity as any;
  return typedActivity.flatMap(({ title }) => {
    if (title.startsWith("Searched for ")) {
      return [title.substring("Searched for ".length)];
    } else {
      return [];
    }
  });
}

// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
// toxicity | severe_toxicity | identity_attack | insult | threat | sexual_explicit | obscene
const labelsToInclude = [
  "toxicity",
  "severe_toxicity",
  "identity_attack",
  "insult",
  "threat",
  "sexual_explicit",
  "obscene",
];

export async function ignoreFeedback(): Promise<string[]> {
  // The minimum prediction confidence.
  const threshold = 0.9;

  var startTime = performance.now();
  const model = await toxicity.load(threshold, labelsToInclude);
  var endTime = performance.now();
  console.log(`Model loading took: ${(endTime - startTime) / 1000} s`);

  startTime = performance.now();
  const searches = getSearches().slice(0, 300);
  var endTime = performance.now();
  console.log(`Parsing searches took: ${(endTime - startTime) / 1000} s`);

  console.log(`sentences.length: ${searches.length}`);

  // We need to batch otherwise we're running into memory issues
  // Parsing also needs to be performed per batch because of how the output is formatted
  startTime = performance.now();

  async function labelBatch(batch: string[]) {
    const predictions = await model.classify(batch);

    startTime = performance.now();
    // The output from the model is kind of weird looking, the easiest way to understand
    // this parsing is actually to look at the output data consul log to the rescue!
    const labeled = batch.map((searchQuery, index) => {
      // Ideally this will be typed, mostly for readability
      let searchLabeled: any = { searchQuery };
      for (const labelPrediction of predictions) {
        const { label, results } = labelPrediction;
        const resultForCurrentSearch = results[index];
        //   const isMatch = resultForCurrentSearch.match;
        const confidence = resultForCurrentSearch.probabilities[1];
        searchLabeled[label] = confidence;
      }

      return searchLabeled;
    });

    return labeled;
  }

  const batches = _.chunk(searches, 5);
  let labeled: any[] = [];
  for (const batch of batches) {
    console.log(`New batch starting`);
    const labeledBatch = await labelBatch(batch);
    labeled = labeled.concat(labeledBatch);
  }

  function top(label: string) {
    const n = 100;
    const top = [...labeled]
      .sort((a, b) => {
        return b[label] - a[label];
      })
      .slice(0, n);

    console.log(`Top ${n} ${label}`);
    let results: string[] = [];
    for (const search of top) {
      const confidence = Math.round(search[label] * 100);
      const searchAndConfidence = `${search.searchQuery}, ${confidence} %`;
      results.push(searchAndConfidence);
      console.log(searchAndConfidence);
    }
    return results;
  }

  // Unfortunately there's is a lot of overlap in for my personal search history
  // Only sexual explicit extracted top ones are any good
  // for (const label of labelsToInclude) {
  //   top(label);
  // }

  var endTime = performance.now();
  console.log(`Post processing took: ${(endTime - startTime) / 1000} s`);

  return top("sexual_explicit");
}
