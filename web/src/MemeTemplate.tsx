import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";
import { useState } from "react";

export type Filter =
  | "TwoTruthsOneLieMeme"
  | "UncoverGhostMeme"
  | "TypesOfHeadacheMeme"
  | "GalaxyBrainMeme"
  | "SpongeBobPaysUpMeme"
  | "BlueBookWTFMeme"
  | "FuckedUpMeme"
  | "JerryNewspaperMeme";

function memeUrl(filter: Filter) {
  switch (filter) {
    case "BlueBookWTFMeme":
      return "https://cdn.ebaumsworld.com/mediaFiles/picture/718392/85780339.jpg";
    default:
      // Bobbie hurting kids
      window.alert("Meme not supported");
      return "https://www.tjtoday.org/wp-content/uploads/2021/01/IMG_7502.jpg";
  }
}

export type Editor = { filter: Filter; slots: string[] };

// Sample initialization
export const sampleBlueBookKirill: Editor = {
  filter: "BlueBookWTFMeme",
  slots: [
    "Most recently passed laws",
    "Full body stickers for cars",
    "Redpill sex",
    "Abortion diagram with hanger",
  ],
};

// the first very simple and recommended way:
export function ViewMemeTemplate(props: {
  editor: Editor;
  searches: string[];
  pickerForSlot: (_: number) => void;
}) {
  const { filter, slots } = props.editor;
  const [image] = useImage(memeUrl(filter));
  if (!image) {
    return <div></div>;
  }

  // TODO: need to be aware of resizes
  //
  // I did not want to compare aspect ratios, because it's really hard to visualize for me
  // Maybe there is a more elegant way to do this ...
  const { innerWidth: availableWidth, innerHeight: availableHeight } = window;
  const fractionOfAvailableWidth = image.naturalWidth / availableWidth;
  const fractionOfAvailableHeight = image.naturalHeight / availableHeight;
  const imageAspectRatio = image.naturalWidth / image.naturalHeight;

  // This means if we scaled the image proportionally we will hit width limit first
  // So with is the limiting constraint
  let actualImageWidth, actualImageHeight: number;
  if (fractionOfAvailableWidth > fractionOfAvailableHeight) {
    actualImageWidth = availableWidth;
    actualImageHeight = availableWidth / imageAspectRatio;
  } else {
    actualImageWidth = availableHeight * imageAspectRatio;
    actualImageHeight = availableHeight;
  }

  // Hardcode the width with which some font looks good
  // Scale the font accordingly
  const fixedFontSize = 16;
  const actualImageWidthForFixedFontSize = 403;
  const fontSize =
    fixedFontSize * (actualImageWidth / actualImageWidthForFixedFontSize);

  return (
    <Stage width={actualImageWidth} height={actualImageHeight}>
      <Layer>
        {/* TODO: We should clip the image within acceptable area, later */}
        <Image
          width={actualImageWidth}
          height={actualImageHeight}
          image={image}
        />
        <Text
          text={slots[0]}
          x={0.36 * actualImageWidth}
          y={0.2 * actualImageHeight}
          width={0.2 * actualImageWidth}
          fontSize={fontSize}
          rotation={-4}
        ></Text>
        <Text
          text={`1. ${slots[1]}`}
          x={0.12 * actualImageWidth}
          y={0.45 * actualImageHeight}
          width={0.5 * actualImageWidth}
          fontSize={fontSize}
          rotation={8}
          onClick={() => {
            props.pickerForSlot(1);
          }}
        ></Text>
        <Text
          text={`2. ${slots[2]}`}
          x={0.2 * actualImageWidth}
          y={0.5 * actualImageHeight}
          width={0.3 * actualImageWidth}
          fontSize={fontSize}
          rotation={10}
        ></Text>
        <Text
          text={`3. ${slots[3]}`}
          x={0.3 * actualImageWidth}
          y={0.55 * actualImageHeight}
          width={0.3 * actualImageWidth}
          fontSize={fontSize}
          rotation={10}
        ></Text>
      </Layer>
    </Stage>
  );
}
