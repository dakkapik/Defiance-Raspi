const { readFileSync, writeFileSync } = require("fs");
const sharp = require("sharp");
const {createWorker} = require("tesseract.js");
const worker = createWorker();
// const file = require("../img2/1.png")

const file = readFileSync("../img3/4.png")

prepImage(file)

async function prepImage(file){

    // const rectangle =  { left: 159, top: 64, width: 68, height: 504 }

    const data = await sharp(file)
    // .normalise()
    .gamma(2.3)
    // .modulate({hue: 180, brightness: 1.1, saturation:  1.1})
    .extractChannel( "blue")
    // .threshold(0)
    .withMetadata()
    .toFormat("tiff", {quality: 100, bitdepth: 1, compression: "lzw", xres:3 , yres: 4})
    .toBuffer()

    writeFileSync("./shot.tiff", data);

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    
    const {data: {text}} = await worker.recognize(data,
        //  { rectangle }
        );

    console.log(text)

    await worker.terminate();
}

