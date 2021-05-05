const envPath = "../.env"
if(!require("fs").existsSync(envPath)){
    //MANAGE STORE GENERATION ON STARTUP?
    require("fs").writeFileSync(envPath, "NODE_ENV=test\nSTORE=psq2")
}
require("dotenv").config({path: envPath}); 
//create .env file on start
if(!process.env.NODE_ENV){
    console.log("CRITICAL ERROR: NODE_ENV not found");
    console.log("CRITICAL ERROR: add NODE_ENV to .env file");
    process.exit();
}
if(!process.env.STORE){
    console.log("CRITICAL ERROR: store not found");
    console.log("CRITICAL ERROR: add store to .env file");
    process.exit();
}

process.env.DEVICE_NAME = "raspi-" + makeId(5);

const { 
    capture: CAPTURE_IP, 
    extract: ENDPOINT 
} = require("config").get("endpoints")

const store = process.env.STORE;
const deviceName = process.env.DEVICE_NAME;
const env = process.env.NODE_ENV

console.log("staring capture client in ", env, " mode");
console.log("capture ip: ", CAPTURE_IP);
console.log("extract endpoint: ", ENDPOINT);
console.log("selected store: ", store);

const socket = require("socket.io-client")(ENDPOINT);
const puppeteer = require("puppeteer");

let browserSelect = {};
let capturePage = null;
let puppetBrowser = null;

if(process.platform === "linux"){
    browserSelect = { executablePath: 'chromium-browser' };
};

if(env === "mock"){
    require("./mock")(socket)
} else if (env === "mock-r"){
    require("./mock")(socket)
} else {
    socket.on("connect", () => {
        //make raspi name
        socket.emit("set-capture-device", {
            name: deviceName, 
            store: store, 
            mode: env
        })
        
        console.log("CONNECTION: ", socket.connected);

        startBrowser(browserSelect)
        .then(({page, browser}) => {
            capturePage = page
            puppetBrowser = browser
        })
        .catch((error) => emitError(error));
    
    });
    
    socket.on("disconnect", () => {
        
        console.log("CONNECTION: ", socket.connected);

        puppetBrowser.close()
        .then(() => puppetBrowser = null)
        
    });
    
    socket.on("send-capture", () => {
        if(capturePage){
            capturePage.screenshot({type: "png", omitBackground: true})
            .then(screenshot => {
                socket.emit("capture", { name: deviceName, screenshot });
            })
            .catch(err => emitError({fn: "screenshot", err}));
        };
    });

    // socket.on("stores", (stores) => {
    //     console.log(stores)
    // })

    socket.on("error", (error) => {
        console.log(error);
        socket.close();
    });
}


function emitError (error) {
    const { fn, err } = error;
    socket.emit("error", error );
    console.error(`${fn} ERROR: ${err}`);
};

function startBrowser(){
    return new Promise(( resolve, reject ) => {
        puppeteer.launch(browserSelect)
        .then((browser) => {
            browser.newPage()
            .then(page => {
                page.setDefaultNavigationTimeout(0);
                page.goto(CAPTURE_IP)
                .then(() => resolve({page, browser}))
                .catch(err => reject({fn: "goto", err}))
            })
            .catch(err => reject({fn: "newPage", err}))
        })
        .catch(err => reject({fn:"puppeteer.launch", err}))
    });
};

function makeId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}