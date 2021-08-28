const _ = require("lodash");
const fs = require("fs");
var path = require("path");
const { split } = require("lodash");

// To get text data:
// Install IPFS, run daemon
// ipfs refs <FOLDERCID>
// ipfs ls <FOLDERCID> > ImageHashes.txt
// Ideally we use pinata so its faster, took ~20m to download 700mb

// const {
// imageData,
// } = require("./ImageFolders/Final_GeneratedImages_1629966248697");

const projectPrefix = "Neapolitan-";
const projectFolderCID = ""

const filepath = path.join(__dirname, "ImageHashes.txt");

var rawImageHashes = fs.readFileSync(filepath).toString().split("\n");
// Example:
// QmYGb8UCtLyamhpSGxkbWtnMNGHxJbsp9bLumgPueqmcpa 220559 Neapolitan-0000-[Vanilla][Banana][Apple].jpg

const imageHashArr = [];

for (const imageHash of rawImageHashes) {
  if (!imageHash.includes(projectPrefix)) continue;
  const splitArr = imageHash.split(" ");
  const 
  imageHashArr.push({ hash: splitArr[0], name: splitArr[2] });
}

console.log(imageHashArr[0]);

let remapping = {
  CrazyHair: "Curly Hair",
  NerdGlasses: "Genius Glasses",
  "3DGlasses": "3D Glasses",
  VR: "VR",
  "Do-Rag": "Do-Rag",
  // "NerdGlasses": "Genius Glasses",
};

let template = {
  name: "Neopolitan #", //+ number
  description: "Neopolitan #", //+ number
  image: "https://rebelpunks.s3.amazonaws.com/", //+ hash //TODO: replace with base url of whereever the images are uploaded, S3 for now...
  image24px: "https://ipfs.io/ipfs/",
  attributes: [],
};

let templateLeftFlavor = {
  trait_type: "Left Flavor",
  value: "",
};

let templateCenterFlavor = {
  trait_type: "Center Flavor",
  value: "",
};
let templateRightFlavor = {
  trait_type: "Center Flavor",
  value: "",
};

let abvTypeToAttribute = {
  MN: ["Masculine", "Alien"],
  FN: ["Feminine", "Alien"],
};

for (let x = 0; x < imageData.length; x++) {
  // for(let x =0; x < 20; x++){
  let tempTemplate = _.cloneDeep(template);
  const thisPunkData = punkData[x];

  const punkAttributes = thisPunkData[1];

  const punkInt = parseInt(thisPunkData[0]);
  tempTemplate["name"] = `${tempTemplate["name"]}${punkInt}`;
  tempTemplate["description"] = `${tempTemplate["description"]}${punkInt}`;

  //TODO HERE
  let imageName = `rebelpunk-${thisPunkData[0]}-`;
  for (let p = 0; p < punkAttributes.length; p++) {
    imageName = `${imageName}%5B${punkAttributes[p]}%5D`;
  }
  imageName = `${imageName}.png`;

  tempTemplate["image"] = `${tempTemplate["image"]}${imageName}`;
  tempTemplate["image24px"] = `${tempTemplate["image24px"]}${thisPunkData[2]}`;

  //Parse // '[MN][Cigarette][Earring][NerdGlasses]'
  for (let y = 0; y < punkAttributes.length; y++) {
    if (y === 0) {
      /** Add Type Data */
      let tempType1 = _.cloneDeep(templateBase);
      tempType1.value = abvTypeToAttribute[punkAttributes[0]][0];
      tempTemplate.attributes.push(tempType1);

      let tempType2 = _.cloneDeep(templateTone);
      tempType2.value = abvTypeToAttribute[punkAttributes[0]][1];
      tempTemplate.attributes.push(tempType2);
    } else {
      /** Add Attributes */
      let tempAccessory1 = _.cloneDeep(templateAccessory);

      tempAccessory1.value = punkAttributes[y];
      //Hotswap name if in remapping object.
      if (remapping[punkAttributes[y]] != undefined) {
        tempAccessory1.value = remapping[punkAttributes[y]];
      } else {
        //TODO: Split ON Capital Letters and add spaces to attributes.
        let spacesBeforeCapitols = punkAttributes[y]
          .replace(/([A-Z])/g, " $1")
          .trim();
        if (spacesBeforeCapitols != punkAttributes[y]) {
          tempAccessory1.value = spacesBeforeCapitols;
        }
      }

      tempTemplate.attributes.push(tempAccessory1);
    }
  }

  let tempAttributeCount1 = _.cloneDeep(templateAttributeCount);
  tempAttributeCount1.value = `${punkAttributes.length - 1}`;
  tempTemplate.attributes.push(tempAttributeCount1);

  // fs.writeFile(`/ipfs/UriJsonTest/${punkInt}-test.json`, JSON.stringify(tempTemplate), {flag: 'r+'}, err => {
  fs.writeFile(
    `ipfs/ipfsURIJSON_FromLocalFileName/${punkInt}.json`,
    JSON.stringify(tempTemplate, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    }
  );
  // console.log(tempTemplate);
}
