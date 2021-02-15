const puppeteer = require("puppeteer");
const http = require("http");

//handle no page error => needs to start capture page on target machine

getShoot().then((screenShot)=>{sendHttpReques(screenShot)});

function sendHttpReques(data){

    console.log(data);

    const options = {
        hostname: "localhost",
        port: 3000,
        method: "POST",
    };

    const req = http.request(options, res=>{
        console.log("status code: ", res.statusCode)
    });
    
    req.write(data);
    
    req.on("error", error =>{
        console.error(error);
    });

    req.end();
};

async function getShoot (){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://192.168.0.3:8080/", {waitUntil: 'networkidle2'});
    const screenShot = await page.screenshot({type: "png", omitBackground: true});
    await browser.close();
    return screenShot;
}