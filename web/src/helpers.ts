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
