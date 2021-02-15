const http = require("http");
const Stream = require("stream");
const fs = require("fs")

// const readableStream = fs.createReadStream(__dirname + "/shot.png", "base64");

// readableStream.on("data", function(chunk){
//     console.log("new chunk")
//     console.log(chunk)
// })



const server = http.createServer((req, res)=>{
    fs.readFile(__dirname + "/shot.png", (err, data)=>{
        res.end(data)
    })
})

server.listen(3000)


// const readableStream = new Stream.Readable({
//     read() {}
// });

// const writeableStream = new Stream.Writable()

// writeableStream._write = (chunk, encoding, next) =>{
//     console.log(chunk.toString())
//     next()
// }

// readableStream.pipe(writeableStream)

// readableStream.push("hi!");
// readableStream.push("ho")