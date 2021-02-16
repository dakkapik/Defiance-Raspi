const puppeteer = require("puppeteer");
const Stream = require("stream");
const axios = require("axios");
const http = require("http");
const fs = require("fs");
const { pipeline } = require("stream")

//handle no page error => needs to start capture page on target machine

const server = http.createServer(
    async (req, res)=>{
        const screenshot = await getShoot()
        fs.writeFileSync("shot.png", screenshot)
        console.log("lenght: ", screenshot.length)
        console.log("screenshot: ", screenshot)
        const stream = bufferToStream(screenshot)
        pipeline(stream, res , (err)=>{
            if(err) console.error(err)
        })
    }
    // (req, res)=>{
    //     console.log(fs.createReadStream("shot.png"))
    //     pipeline(fs.createReadStream("shot.png"), res, 
    //     (err)=>{ if(err) console.error(err)} )
    // }
)

server.listen(3000,()=>{console.log("server listening")})

function sendHttpReques(data){
    const package = JSON.stringify(data)
    
    const options = {
        hostname: "localhost",
        port: 3000,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': package.length
        }
    };

    const req = http.request(options, res=>{
        console.log("status code: ", res.statusCode)

        res.on("data", d=>{console.log(d)})
    });

    req.on("error", error =>{
        console.error(error);
    });

    req.write(package);
    req.end();
}

function sendAxiosRequest(data){
    axios.post("http://localhost:3000",{
        data 
    })
    .then(res=>{
        console.log(res.status)
    })
    .catch(error=>{
        console.error(error)
    })
}

function bufferToStream(binary){
    return Stream.Readable.from(binary)
}

async function getShoot (){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://192.168.0.4:8080/", {waitUntil: 'networkidle2'});
    const screenShot = await page.screenshot({type: "png", omitBackground: true});
    await browser.close();
    return screenShot;
}