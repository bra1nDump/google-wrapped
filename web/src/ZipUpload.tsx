import { getSearches } from "./helpers";
import { useRef } from "react";
import { ZipReader, BlobReader, TextWriter } from "@zip.js/zip.js";
import React from "react";

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
