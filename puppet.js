const puppeteer = require("puppeteer");
const http = require("http");
const Stream = require("stream");
const { pipeline } = require("stream");

//handle no page error => needs to start capture page on target machine

let browserSelect = {};
if(process.platform === "linux"){
    browserSelect = {executablePath: 'chromium-browser'};
};

startBrowser();

setInterval(()=>{
    startBrowser(); 
}, 300000)

function startBrowser(){
    puppeteer.launch(browserSelect).then(async (browser)=>{
        const page = await browser.newPage();
        await page.goto("http://192.168.0.3:8080/");
        const interval = setInterval(async ()=>{
            const screenShot = await page.screenshot({type: "png", omitBackground: true});
            sendHttpReques(screenShot)
        }, 2000);
        setTimeout(()=>{
            console.log("reseting browser...");
            clearInterval(interval);
        }, 300000);
    });
}

function sendHttpReques(data){
    
    console.log("sending shot");

    const options = {
        hostname: "69.65.91.236",
        port: 13131,
        method: "POST",
        path:"/api/raspi"
    };

    const req = http.request(options, res=>{
        console.log("status code: ", res.statusCode)
        req.end();
    });
    
    pipeline(bufferToStream(data), req, (err)=>{
        if(err){console.error(err)};
    });
    
    req.on("error", error =>{
        console.error(error);
    });
};

function bufferToStream(binary){
    return Stream.Readable.from(binary);
};