export type ActivityEntryJSON = {
  title: string;
  titleUrl: string;
  time: string;
};

// Search example
// time: '2021-04-21T05:53:33.871Z'
// title: 'Searched for did not get insurance if another driver on.car accident scene'
// titleUrl: 'https://www.google.com/search?q=did+not+get+insurance+if+another+driver+on.car+accident+scene'

// Website visit example
// time: '2022-10-02T06:26:08.626Z'
// title: 'Visited How to Upgrade Colab with More Compute | by Yufeng G | Medium'
// titleUrl: 'https://www.google.com/url?q=https://medium.com/%40yufengg/how-to-upgrade-colab-with-more-compute-64d53a9b05dc&usg=AOvVaw2uKwsX1GPP7YuI3LE1tMMp'

export type Search = {
  kind: "Search";
  date: Date;
  query: string;
};
export type WebsiteVisit = {
  kind: "WebsiteVisit";
  date: Date;
  url: URL;
};

export type ActivityEntry = Search | WebsiteVisit;

/**
 * @param activity Passed in from the zip upload. Assumes format is JSON
 * @returns Searches and website visits alongside with their dates
 */
export function parseActivity(activity: ActivityEntryJSON[]): ActivityEntry[] {
  return activity.flatMap(({ title, time, titleUrl }) => {
    const date = new Date(time);
    if (title.startsWith("Searched for ")) {
      return {
        kind: "Search",
        date,
        query: title.substring("Searched for ".length),
      } as Search;
    } else if (title.startsWith("Visited ")) {
      try {
        // This actually extracts the title for the website, for example, if title unavailable extracts URL
        // title: "Visited Bitbucket | Git solution for teams using Jira"
        const url = new URL(
          titleUrl.substring("https://www.google.com/url?q=".length)
        );
        return {
          kind: "WebsiteVisit",
          date,
          url,
        } as WebsiteVisit;
      } catch (_) {
        console.log(`Failed to parse URL for visited website ${title}`);
        return [];
      }
    } else {
      // Failed parsing, probably form google maps searches
      return [];
    }
  });
}

export function getSearches(activityEntries: ActivityEntry[]) {
  return activityEntries.filter(({ kind }) => kind === "Search") as Search[];
}

export function getWebsiteVisits(activityEntries: ActivityEntry[]) {
  return activityEntries.filter(
    ({ kind }) => kind === "WebsiteVisit"
  ) as WebsiteVisit[];
}

/**
 * Fetches origin/bag_<topic>.txt and parses by newline
 * @param topic
 * @returns words for the topic
 */
export async function getBagOfWords(topic: string): Promise<string[]> {
  const href = window.location.href;
  const response = await fetch(`${href}/bag_${topic}.txt`);
  const wordsNewLineDelimited = await response.text();

  return wordsNewLineDelimited.split("\n").filter((x) => x.trim() !== "");
}
