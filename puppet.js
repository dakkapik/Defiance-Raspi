require("dotenv").config(); 

if(!process.env.NODE_ENV){
    console.log("CRITICAL ERROR: NODE_ENV not found");
    console.log("CRITICAL ERROR: add NODE_ENV to .env file");
    process.exit();
}
if(!process.env.store){
    console.log("CRITICAL ERROR: store not found");
    console.log("CRITICAL ERROR: add store to .env file");
    process.exit();
}

const { 
    capture: CAPTURE_IP, 
    extract: ENDPOINT 
} = require("config").get("endpoints")

const STORE = process.env.store;

console.log("staring capture client in ", process.env.NODE_ENV, " mode");
console.log("capture ip: ", CAPTURE_IP);
console.log("extract endpoint: ", ENDPOINT);
console.log("selected store: ", STORE);

const socket = require("socket.io-client")(ENDPOINT);
const puppeteer = require("puppeteer");

let browserSelect = {};
let page = null ;

if(process.platform === "linux"){
    browserSelect = { executablePath: 'chromium-browser' };
};

if(process.env.NODE_ENV !== "mock"){
    socket.on("connect", () => {
        
        socket.emit("set-store", STORE + "-" + process.env.NODE_ENV)
        
        console.log("CONNECTION: ", socket.connected);

        startBrowser()
        .then(pag => page = pag)
        .catch((error) => emitError(error));
    
    });
    
    socket.on("disconnect", () => {
    
        console.log("CONNECTION: ", socket.connected);
    
    });
    
    socket.on("send-capture", () => {
        if(page){
            page.screenshot({type: "png", omitBackground: true})
            .then(screenshot => {
                socket.emit("capture", {STORE, screenshot});
            })
            .catch(err => emitError({fn: "screenshot", err}));
        };
    });
} else {
    require("./mock")(socket)
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
                .then(() => resolve( page ))
                .catch(err => reject({fn: "goto", err}))
            })
            .catch(err => reject({fn: "newPage", err}))
        })
        .catch(err => reject({fn:"puppeteer.launch", err}))
    });
};
