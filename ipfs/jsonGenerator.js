const _ = require("lodash");
const fs = require("fs");
var path = require("path");

// To get text data:
// Install IPFS, run daemon
// ipfs refs <FOLDERCID>
// ipfs ls <FOLDERCID> > ImageHashes.txt
// Ideally we use pinata so its faster, took ~20m to download 700mb

const projectPrefix = "Neapolitan";
const projectFolderCID = "QmUJ8R4fgxEicPiRheUf9h34EQrYN8xMvwJQ2HqRnLYiYd";

var imageHashArr = [];

const filepath = path.join(__dirname, "ImageHashes.txt");
var rawImageHashes = fs.readFileSync(filepath).toString().split("\n");

// Example imageHash:
// QmcXn42K4ALzZnaRUYS6CsWcuSnKg5faSnYn1XnSrDf33v 220437 Neapolitan-0006-[Dragonfruit][Lime][PeanutButter].jpg

for (const imageHash of rawImageHashes) {
  if (!imageHash.includes(projectPrefix)) continue;

  const splitHashArr = imageHash.split(" ");
  const hash = splitHashArr[0];
  const rawName = splitHashArr[2];

  // rawName:Neapolitan-0006-[Dragonfruit][Lime][PeanutButter].jpg
  const splitRawNameArr = rawName.split("-");
  const index = splitRawNameArr[1];
  // index: 0006

  const rawAtts = splitRawNameArr[2];
  // rawAtts: [Dragonfruit][Lime][PeanutButter].jpg
  const attNamesArr = rawAtts
    .split("]")
    .filter((att) => att.includes("["))
    .map((att) =>
      // Remove left bracket, add spaces between capitals
      att
        .replace("[", "")
        .replace(/([A-Z])/g, " $1")
        .trim()
    );
  // attNamesArr: ['Dragonfruit', 'Lime', 'Peanut Butter']
  const attributes = [
    { trait_type: "Left Flavor", value: attNamesArr[0] },
    { trait_type: "Center Flavor", value: attNamesArr[1] },
    { trait_type: "Right Flavor", value: attNamesArr[2] },
  ];

  const blob = {
    name: `${projectPrefix} #${index}`,
    description: `${projectPrefix} #${index}`,
    image: `https://ipfs.io/ipfs/${projectFolderCID}/${rawName}`,
    attributes: attributes,
  };
  /* Example blob: {
    "name": "Neapolitan #0006",
    "description": "Neapolitan #0006",
    "image": "https://ipfs.io/ipfs/QmUJ8R4fgxEicPiRheUf9h34EQrYN8xMvwJQ2HqRnLYiYd/Neapolitan-0006-[Dragonfruit][Lime][PeanutButter].jpg",
    "attributes": [
      { "trait_type": "Left Flavor", "value": "Dragonfruit" },
      { "trait_type": "Center Flavor", "value": "Lime" },
      { "trait_type": "Right Flavor", "value": "Peanut Butter" }
    ]
  }*/

  // console.log(JSON.stringify(blob));
  fs.writeFileSync(
    `ipfs/generatedJson/${index}.json`,
    JSON.stringify(blob, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

console.log("JSON Generation complete for count", rawImageHashes.length);
