const { fstat } = require("fs");
const Http = require("http");
const { pipeline } = require("stream");
const { createReadStream } = require("fs")

sendHttpRequest(createReadStream("./img2/2.png"))

function sendHttpRequest(stream){
    
    console.log("sending shot");

    const options = {
        hostname: "69.65.91.236",
        port: 3000,
        method: "POST",
        path:"/api/raspi"
    };

    const req = Http.request(options, res=>{
        console.log("status code: ", res.statusCode)
        req.end();
    });
    
    pipeline(stream, req, (err)=>{
        if(err){console.error(err)};
    });
    
    req.on("error", error =>{
        console.error(error);
    });
};

