const ENDPOINT = "http://69.65.91.236:13131"
const CAPTURE_IP = "http://192.168.0.3:8080/"

const socket = require("socket.io-client")(ENDPOINT);
const puppeteer = require("puppeteer");

let browserSelect = {};
let page = null ;

if(process.platform === "linux"){
    browserSelect = { executablePath: 'chromium-browser' };
};

socket.on("connect", () => {

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
            socket.emit("capture", screenshot);
        })
        .catch(err => emitError({fn: "screenshot", err}));
    };
});

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
