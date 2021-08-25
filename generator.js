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
    odds: 1000, // Out of 10k
  },
  {
    attribute: "Vanilla",
    odds: 1000, // Out of 10k
  },
  {
    attribute: "Strawberyy",
    odds: 1000, // Out of 10k
  },
  {
    attribute: "Coffee",
    odds: 1000, // Out of 10k
  },
];

var sumOfOdds = 0;
for (var i = 0; i < attributesArray.length; i++) {
  sumOfOdds = sumOfOdds + attributesArray[i]["odds"];
}

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
const projectName = "Neapolitan";
const totalAvatars = 10000;

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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function exportVisibleLayers(filename) {
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
  // var attString = "[" + type.replace(/\s+/g, "") + "]";
  var attString = "";

  for (var i = 0; i < atts.length; i++) {
    var thisAtt = atts[i];
    attString = attString + "[" + thisAtt + "]";

    var indexOfUnskinned = layerIndexMap[unskined];

    layers.push(indexOfUnskinned);
  }

  for (var i = 0; i < layers.length; i++) {
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
  function getAtt() {
    var totalNumberOfAttributes = sumOfOdds;

    const random = Math.floor(Math.random() * totalNumberOfAttributes);
    var attCounter = 0;
    var i = 0;

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
    const attribute = att["attribute"];

    for (var i = 0; i < existingAtts.length; i++) {
      if (existingAtts[i]["attribute"] === attribute) {
        return false;
      }
    }
    return true;
  }

  function isUniqueAvatar(type, attObjects) {
    var attributes = [];
    for (var j = 0; j < attObjects.length; j++) {
      var ob = attObjects[j];
      var attName = ob["attribute"];
      attributes.push(attName);
    }
    const hash = hashForAvatar(type, attributes);

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
      var att = getAtt();
      if (filterAtt(att, type, arr)) {
        arr.push(att);
      }
    }
    return arr;
  }

  // MAIN FUNCTION

  const attNameCount = {};

  for (var i = 0; i < totalAvatars; i++) {
    var attObjects = getAtts(3, null, []);
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
      atts: attributes,
      count: fullCount,
      name: projectName + " #" + fullCount,
    };

    avatars.push(avatar);
    // consoleLogFile.writeln(
    // "Saved avatar: " + fullCount + " atts:" + attributes.length
    // );
  }
  consoleLogFile.writeln("----- All avatars generated ----");

  shuffleArray(avatars);
  for (var i = 0; i < avatars.length; i++) {
    var ava = avatars[i];
    if (exportEnabled) {
      exportAvatarFromPhotoshop(ava, i);
    }
  }

  const doneTime = Date.now();
  const workTime = doneTime - startTime;
  consoleLogFile.writeln(
    "Complete. End timestamp " + Date.now() + "Time: " + workTime
  );
  alert("Done running generator after " + workTime / 1000 + "Seconds");
}
