const { chromium } = require("playwright");

async function launchBrowser() {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 200
    });

    const context = await browser.newContext({
        storageState: "naukri-session.json"
    });

    const page = await context.newPage();

    return {
        browser,
        context,
        page
    };
}

module.exports = {
    launchBrowser
};
