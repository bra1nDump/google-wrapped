import { ActivityEntry, parseActivity } from "./helpers";
import { useRef } from "react";
import { ZipReader, BlobReader, TextWriter } from "@zip.js/zip.js";
import React from "react";

export function ZipUpload(props: {
  nextStage: (searches: ActivityEntry[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#eee",
        borderRadius: "12px",
      }}
    >
      <input
        name="file"
        type="file"
        accept=".zip"
        style={{
          padding: "1%",
          backgroundColor: "#eee",
          border: "2px solid #ccc",
          borderRadius: "8px",
          borderStyle: "dashed",
          color: "#000",
          fontWeight: "700",
        }}
        onInput={async ({ currentTarget }) => {
          const file = currentTarget.files?.[0];
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
          const searches = parseActivity(json);

          // TODO: Remove in prod, logging
          searches.slice(0, 10).map(console.log);

          props.nextStage(searches);
        }}
      ></input>
    </div>
  );
}
