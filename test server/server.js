const express = require("express");
const server = express();
const { createWorker } = require("tesseract.js");
const worker = createWorker();
const { Buffer } = require("buffer");
// const { writeFileSync } = require("fs");

server.post("/", (req, res)=>{
    console.log("request recived");

    const chunks = [];

    req.on("data", (chunk)=>{
        chunks.push(Buffer.from(chunk))
    });
    
    req.on("error", (err)=>{
        console.error(err)
    });

    req.on("end", ()=>{
        const file = Buffer.concat(chunks);
        writeFileSync("shot.png", file);
        doOCR(file);
        res.status(200).send("done");
    });

});

const port = 3000 || process.env.PORT

server.listen(port, ()=>{console.log("server listening port: ", port)})

async function doOCR (data){
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data: {text} } = await worker.recognize(data);
    console.log(text);
}