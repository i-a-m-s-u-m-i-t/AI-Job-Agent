const { launchBrowser } = require("../services/browser");
const { searchJobs } = require("./search");
const { extractJobs } = require("./jobs");
const { enrichJobs } = require("./details");

async function startNaukri() {

    const { browser, context, page } = await launchBrowser();

    await searchJobs(page);

    await extractJobs(page);

    await enrichJobs(context);

    await browser.close();

}

module.exports = {
    startNaukri
};