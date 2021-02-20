const puppeteer = require("puppeteer");

(async ()=>{
    const browser = await puppeteer.launch({ executablePath: 'chromium-browser'});
    const page = await browser.newPage();
    await page.goto("http://192.168.0.4:8080/", {waitUntil: 'networkidle2'});
    await page.screenshot({path: "shot.png", type: "png", omitBackground: true});

    await browser.close();
})();
