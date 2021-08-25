// Notes:
// Currently difficult to accurately estimate likelihood, as counts may sum to any kind of number
// Any increase in count of one reduces the likelihood of some of the rest
// Maybe this is okay. Probably just want to log the odds of each attribute at the very beginning. That way you can continue to play with the probabilities.
// How could a "fixed" probability be set? Say you don't want the odds of this particular one to drop.
// Could have a fixed property. Assume the odds are out of 10k. Now if the sum of all the odds properties is greater or lesser than 10k, if fixed the odds scale to maintain the original ratio.
// For example, say odds = 750. If the sum of odds is only 5k, then that odds drops to 375. But wait, that changes the sum.
// There is probably an algebraic solution to this, or you could just binary search then round once you get a margin of less than 1.
// Filtering also messes with the odds. Highly filtered traits will be less likely.
// Perhaps projects first sample by category (hats, glasses, etc), then have odds within each category. That way the category sums reasonably and you don't have obscure competition between distant attributes.

// const categoriesArray = [{ cat: "L", odds: 10000 }];

const attributesArray = [
  {
    attribute: "Chocolate",
    count: 2459, // replace with "odds"
  },
];

var maleNumberOfAttributes = 0; // computed
var femaleNumberOfAttributes = 0;

const avatars = [];
const avatarHash = {};
const layerIndexMap = {};

const isTest = false;
const exportEnabled = false;

const startTime = Date.now();
const doc = app.activeDocument;
const docName = doc.name.replace(/\.[^\.]+$/, "");
const docPath = doc.path;
const allLayers = doc.layers;
const numberOfLayers = allLayers.length;
const folderName = "ImageFolders/GeneratedImages_" + startTime;
const extensionName = ".png";
const projectName = "Neapolitans";

var f = new Folder("/Users/andrewschreiber/git/neapolitanNFT/" + folderName);
if (!f.exists) f.create();

var consoleLogFile = File(
  docPath + "/" + folderName + "/" + startTime + "_generatorlog.txt"
);
consoleLogFile.encoding = "UTF8";
consoleLogFile.open("e", "TEXT", "????");
consoleLogFile.writeln("There are " + numberOfLayers + " layers");
consoleLogFile.writeln("Start timestamp " + startTime);
hideAllLayers();
runGenerator();

// Helpers
function inArray(item, array) {
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (array[i] === item) return true;
  }
  return false;
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

function mapCryptoPunksAttNameToPSDLayer(cpName) {
  return cpName;
}

function exportVisibleLayers(filename) {
  var retinaFolder = Folder(docPath + "/" + folderName);
  if (!retinaFolder.exists) retinaFolder.create();
  var test = "";
  if (isTest) {
    test = "test";
  }
  pngFile = File(
    docPath +
      "/" +
      folderName +
      "/" +
      test +
      projectName +
      "-" +
      filename +
      extensionName
  );
  /** check if the PNG already exists or not - delete if so */
  if (pngFile.exists) pngFile.remove();
  /** save the PNG */
  pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.compression = 9;
  doc.saveAs(pngFile, pngSaveOptions, true, Extension.LOWERCASE);

  // consoleLogFile.writeln("File Exported: " + filename);
}

function hideAllLayers() {
  for (var i = 0; i < numberOfLayers; i++) {
    layerIndexMap[allLayers[i].name] = i;
    if (allLayers[i].visible == true) allLayers[i].visible = false;
  }
  // consoleLogFile.writeln("All Layers Hidden");
}

/// Taking in a object that describes the attributes and then properly activating the layers in PS.
function exportAvatarFromPhotoshop(avatar, count) {
  const type = avatar.type;
  const atts = avatar.atts;

  const layers = [];
  var attString = "[" + type.replace(/\s+/g, "") + "]";

  for (var i = 0; i < atts.length; i++) {
    var thisAtt = atts[i];
    attString = attString + "[" + thisAtt + "]";

    // L Chocolate
    // M Chocolate
    // R Chocolate

    var indexOfUnskinned =
      layerIndexMap[mapCryptoPunksAttNameToPSDLayer(unskined)];

    layers.push(indexOfUnskinned);
  }

  for (var i = 0; i < layers.length; i++) {
    // consoleLogFile.writeln("Making visible: " + layers[i]);
    allLayers[layers[i]].visible = true;
  }
  const filename = pad(count, 4) + "-" + attString;

  exportVisibleLayers(filename);
  for (var i = 0; i < layers.length; i++) {
    allLayers[layers[i]].visible = false;
  }
}

function hashForAvatar(type, attributes) {
  attributes.sort();
  var total = "";
  for (var i = 0; i < attributes.length; i++) {
    total = total + attributes[i];
  }
  const hash = type + total;

  return hash;
}

function runGenerator() {
  const totalAvatars = 10000;

  const avatarTypes = {
    "M A": 1133,
    "M L": 1133,
    "M M": 1133,
    "M D": 1133,
    "F A": 1337,
    "F L": 1337,
    "F M": 1337,
    "F D": 1337,
    "M Z": 18,
    "F Z": 69,
    "M E": 4,
    "F E": 20,
    "M N": 1,
    "F N": 8,
  };
  const avatarTypes1 = {
    "M A": 100,
    "M L": 100,
    "M M": 100,
    "M D": 100,
    "F A": 100,
    "F L": 100,
    "F M": 100,
    "F D": 100,
    "M Z": 1,
    "F Z": 1,
    "M E": 1,
    "F E": 1,
    "M N": 1,
    "F N": 1,
  };

  const zeroAtts = 3; // female ape, female zombie, female alien
  const oneAtts = 333;
  const twoAtts = 3560; // 3560
  const threeAtts = 4501;
  const fourAtts = 1420; // 1420
  const fiveAtts = 166;
  const sixAtts = 11;
  const sevenAtts = 8;
  // const attCountOriginal = [8, 333, 3560, 4501, 1420, 166, 11, 1];
  const attCountOriginal = [0, 100, 3560, 4501, 1420, 166, 0, 0];

  // const attCountOriginal = [1, 1, 1, 1, 1, 1, 5000, 1];
  const typeCountOriginal = [9, 24, 88, 3840, 6039];

  for (var i = 0; i < attributesArray.length; i++) {
    maleNumberOfAttributes =
      maleNumberOfAttributes + attributesArray[i]["maleCount"];
    femaleNumberOfAttributes =
      femaleNumberOfAttributes + attributesArray[i]["femaleCount"];
  }

  consoleLogFile.writeln("Male num" + maleNumberOfAttributes);
  consoleLogFile.writeln("Female num" + femaleNumberOfAttributes);

  function getAttCount(generatedType) {
    const random = Math.floor(Math.random() * 10000);
    const c = attCountOriginal;
    var count = 0;
    if (random < c[1]) {
      count = 1;
    } else if (random < c[1] + c[2]) {
      count = 2;
    } else if (random < c[1] + c[2] + c[3]) {
      count = 3;
    } else if (random < c[1] + c[2] + c[3] + c[4]) {
      count = 4;
    } else if (random < c[1] + c[2] + c[3] + c[4] + c[5]) {
      count = 5;
    } else if (random < c[1] + c[2] + c[3] + c[4] + c[5] + c[6]) {
      count = 6;
    } else {
      count = 4;
    }

    if (
      generatedType.indexOf("E") !== -1 ||
      generatedType.indexOf("N") !== -1
    ) {
      return Math.min(count, 4);
    }

    return count;
  }

  function getAtt(isMale) {
    var totalNumberOfAttributes = 27535;
    if (isMale) {
      totalNumberOfAttributes = maleNumberOfAttributes;
    } else {
      totalNumberOfAttributes = femaleNumberOfAttributes;
    }
    // const totalNumberOfAttributes = 27535; //Sum of all counts
    const random = Math.floor(Math.random() * totalNumberOfAttributes);
    var attCounter = 0;
    var i = 0;

    const countString = isMale ? "maleCount" : "femaleCount";

    while (random > attCounter - 1) {
      var attObjectSelected = attributesArray[i];
      var selectedCount = +attObjectSelected[countString];
      var name = attObjectSelected["attribute"];
      if (selectedCount + attCounter >= random) {
        // consoleLogFile.writeln("Selected " + name);

        return attObjectSelected;
      } else {
        attCounter = attCounter + selectedCount;
        i++;
      }
    }
    consoleLogFile.writeln(
      "Never found a matching attribute. Random: " +
        random +
        " att counter:" +
        attCounter +
        " att count:" +
        totalNumberOfAttributes
    );
    throw new Error("Never found a matching attribute");
  }

  function filterAtt(att, type, existingAtts) {
    // TODO:
    // Earrings should only be with hairs and hats that dont block it
    // Blonde bob and eyemask do not work on men
    // Half shaved on men doesn't work with any hats
    // Crazy Hair works with CapForward and PoliceCap and Purple cap

    const attribute = att["attribute"];
    const species = att["species"];
    const category = att["cat"];
    const isMale = type.indexOf("F") === -1;

    for (var i = 0; i < existingAtts.length; i++) {
      if (existingAtts[i]["attribute"] === attribute) {
        logFiltered(attribute, isMale);
        return false;
      }
    }

    if (type.indexOf("N") !== -1 || type.indexOf("E") !== -1) {
      if (species !== "All") {
        logFiltered(attribute, isMale);

        return false;
      }
    }
    if (type.indexOf("Z") !== -1) {
      if (attribute === "Spots") {
        logFiltered(attribute, isMale);

        return false;
      }
      if (attribute === "Mustache") {
        logFiltered(attribute, isMale);

        return false;
      }
    }
    if (
      !checkSetOfInvalidPairings(
        attribute,
        existingAtts,
        isMale ? maleInvalidPairings : femaleInvalidPairings
      )
    ) {
      // consoleLogFile.writeln("FAIL invalid pair " + attribute);
      logFiltered(attribute, isMale);

      return false;
    }

    const cats = [];
    for (var i = 0; i < existingAtts.length; i++) {
      cats.push(existingAtts[i]["cat"]);
    }
    // consoleLogFile.writeln("Is " + att["cat"] + " among " + cats[0]);
    if (
      checkSetOfSpecialPairings(
        attribute,
        existingAtts,
        isMale ? maleSpecialPairings : femaleSpecialPairings
      )
    ) {
      // consoleLogFile.writeln("PASS Special pair allowed " + attribute);
      return true;
    }

    const monoCat =
      category === "Beard" ||
      category === "Hair" ||
      category === "Smoke" ||
      category === "Eyes" ||
      category === "Hat";

    if (monoCat) {
      // consoleLogFile.writeln("Got mono cat" + category);
      if (inArray(category, cats)) {
        // consoleLogFile.writeln(
        // "FAIL Filtering overlapping category " + attribute
        // );
        logFiltered(attribute, isMale);

        return false;
      }
      if (category === "Hat" && inArray("Hair", cats)) {
        // consoleLogFile.writeln("FAIL Filtering Hat due to Hair " + attribute);
        logFiltered(attribute, isMale);

        return false;
      }
      if (category === "Hair" && inArray("Hat", cats)) {
        // consoleLogFile.writeln("FAIL Filtering Hair due to Hat " + attribute);
        logFiltered(attribute, isMale);

        return false;
      }
    }

    // consoleLogFile.writeln("PASS attribute " + attribute);

    return true;
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function isUniqueAvatar(type, attObjects) {
    var attributes = [];
    for (var j = 0; j < attObjects.length; j++) {
      var ob = attObjects[j];
      var attName = ob["attribute"];
      attributes.push(attName);
    }
    const hash = hashForAvatar(type, attributes);
    // consoleLogFile.writeln("GOT HASH " + hash);

    if (avatarHash[hash]) {
      return false;
    } else {
      avatarHash[hash] = 1;
      return true;
    }
  }

  function getAtts(attCount, type, existingAtts) {
    var arr = existingAtts;
    var i = 0;
    while (i < attCount) {
      var att = getAtt(isMale);
      if (filterAtt(att, type, arr)) {
        arr.push(att);
      }
    }
    return arr;
  }

  // MAIN FUNCTION

  var totalCount = 0;

  const attNameCount = {};

  for (generatedType in avatarTypes) {
    for (var i = 0; i < avatarTypes[generatedType]; i++) {
      var attCount = getAttCount(generatedType);
      var attObjects = getAtts(attCount, generatedType, []);
      // consoleLogFile.writeln(
      // "New Avatar: " + i + " att objects count: " + attObjects.length
      // );

      var attributes = [];
      for (var j = 0; j < attObjects.length; j++) {
        var ob = attObjects[j];
        // consoleLogFile.writeln('New attObj # ' + j + ' is ' + ob);
        var attName = ob["attribute"];
        attributes.push(attName);
      }
      var fullCount = i + totalCount;
      var avatar = {
        type: generatedType,
        atts: attributes,
        count: fullCount,
        name: projectName + " #" + fullCount,
      };

      avatars.push(avatar);
      // consoleLogFile.writeln(
      // "Saved avatar: " + fullCount + " atts:" + attributes.length
      // );
    }
    totalCount = totalCount + avatarTypes[generatedType];
  }
  consoleLogFile.writeln("----- All avatars generated ----");

  shuffleArray(avatars);
  for (var i = 0; i < avatars.length; i++) {
    var reb = avatars[i];
    if (exportEnabled) {
      exportAvatarFromPhotoshop(reb, i);
    }
  }

  const doneTime = Date.now();
  const workTime = doneTime - startTime;
  consoleLogFile.writeln(
    "Complete. End timestamp " + Date.now() + "Time: " + workTime
  );
  alert("Done running generator after " + workTime / 1000 + "Seconds");
}
