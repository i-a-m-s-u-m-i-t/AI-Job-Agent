const { launchBrowser } = require("../services/browser");
const { searchJobs } = require("./search");
const { extractJobs } = require("./jobs");

async function startNaukri() {

    const { browser, page } = await launchBrowser();

    await searchJobs(page);

    await extractJobs(page);

    await browser.close();
}

module.exports = {
    startNaukri
};