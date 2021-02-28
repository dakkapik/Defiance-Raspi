const Http = require("http");
const { pipeline } = require("stream");
const { createReadStream } = require("fs");

sendHttpRequest(createReadStream("./img2/1.png"));

function sendHttpRequest(stream){
    
    console.log("sending shot");

    const options = {
        hostname: "localhost",
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

