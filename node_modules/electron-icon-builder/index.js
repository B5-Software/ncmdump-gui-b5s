#!/usr/bin/env node

const Jimp = require("jimp");
const args = require("args");
const path = require("path");
const fs = require("fs");
const icongen = require("icon-gen");

var pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

args
  .option("input", "Input PNG file. Recommended (1024x1024)", "./icon.png")
  .option("output", "Folder to output new icons folder", "./")
  .option("flatten", "Flatten output structure for electron-builder", false);

const flags = args.parse(process.argv);

// correct paths
var input = path.resolve(process.cwd(), flags.input);
var output = path.resolve(process.cwd(), flags.output);
var flatten = flags.flatten;
var o = output;
var oSub = path.join(o, "icons/");
var PNGoutputDir = flatten ? oSub : path.join(oSub, "png");
var macOutputDir = flatten ? oSub : path.join(oSub, "mac");
var winOutputDir = flatten ? oSub : path.join(oSub, "win");

createPNGs(0).catch((err) => {
  console.log(err);
});

// calls itself recursivly
async function createPNGs(position) {
  const info = await createPNG(pngSizes[position]);
  console.log(info);

  if (position < pngSizes.length - 1) {
    // keep going
    createPNGs(position + 1);
  } else {
    // done, generate the icons
    ensureDirExists(macOutputDir);
    await icongen(PNGoutputDir, macOutputDir, {
      icns: { name: "icon" },
      report: true,
    });

    ensureDirExists(winOutputDir);
    await icongen(PNGoutputDir, winOutputDir, {
      ico: { name: "icon" },
      report: true,
    });

    // rename the PNGs to electron format
    console.log("Renaming PNGs to Electron Format");
    await renamePNGs(0);
  }
}

async function renamePNGs(position) {
  var startName = pngSizes[position] + ".png";
  var endName = pngSizes[position] + "x" + pngSizes[position] + ".png";
  fs.renameSync(
    path.join(PNGoutputDir, startName),
    path.join(PNGoutputDir, endName)
  );
  console.log("Renamed " + startName + " to " + endName);

  if (position < pngSizes.length - 1) {
    // not done yet. Run the next one
    renamePNGs(position + 1);
  } else {
    console.log("\n ALL DONE");
  }
}

async function createPNG(size) {
  var fileName = size.toString() + ".png";

  // make dir if does not exist
  ensureDirExists(output);
  ensureDirExists(oSub);
  if (!flatten) {
    ensureDirExists(PNGoutputDir);
  }

  const image = await Jimp.read(input);
  image.resize(size, size);
  await image.writeAsync(path.join(PNGoutputDir, fileName));

  return "Created " + path.join(PNGoutputDir, fileName);
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
