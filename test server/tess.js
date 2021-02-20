const { createWorker } = require("tesseract.js");

const rectangle = {left: 159, top: 63, width:94, height: 505};

(async ()=>{

    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    
    const { data: {text} } = await worker.recognize("./3.png", {rectangle});
    
    console.log(text);
    
    await worker.terminate();

})();