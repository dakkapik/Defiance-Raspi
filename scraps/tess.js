const { createWorker } = require("tesseract.js");

const worker = createWorker();

(async ()=>{
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {data: {text} } = await worker.recognize("./god.jpg");
    console.log(text);

    await worker.terminate();
})();