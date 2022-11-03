import { useEffect, useState } from "react";
import { ignoreFeedback } from "./tensorFlowToxicity";

// Uses TensorflowJs to get some 'interesting' searches and displays them.
// Used for testing purposes rn, ran on mobile but is prohibitivly slow
export function TopSexualSearchesTensorFlow() {
  const [topSexualSearches, setTopSexualSearches] = useState<string[]>();
  useEffect(() => {
    ignoreFeedback().then((searches) => {
      console.log(`topSexualSearches.length ${searches.length}`);
      setTopSexualSearches(searches);
    });
  }, []);

  return (
    <div>
      <h1>Top Sexual, TensorFlow.js, toxicity model</h1>
      <h1>{topSexualSearches ? "loaded" : "Loading"}</h1>
      {(topSexualSearches ?? []).map((search) => (
        <div>{search}</div>
      ))}
    </div>
  );
}
