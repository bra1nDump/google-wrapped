import { activity } from "./kirill-activity";

export type ActivityEntry = {
  title: string;
};

export function getSearches() {
  const typedActivity: ActivityEntry[] = activity as any;
  return typedActivity.flatMap(({ title }) => {
    if (title.startsWith("Searched for ")) {
      return [title.substring("Searched for ".length)];
    } else {
      return [];
    }
  });
}

/**
 * Fetches origin/bag_<topic>.txt and parses by newline
 * @param topic
 * @returns words for the topic
 */
export async function getBagOfWords(topic: string): Promise<string[]> {
  const origin = window.location.origin;
  const response = await fetch(`${origin}/bag_${topic}.txt`);
  const wordsNewLineDelimited = await response.text();

  return wordsNewLineDelimited.split("\n").filter((x) => x.trim() !== "");
}
