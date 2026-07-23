const config = require("../config.json");

async function searchJobs(page) {

    const searchKeyword = encodeURIComponent(config.jobTitle);

    const url = `https://www.naukri.com/${searchKeyword}-jobs?k=${searchKeyword}`;

    console.log("Searching for:", config.jobTitle);

    await page.goto(url, {
        waitUntil: "networkidle"
    });

    console.log("Search completed.");
}

module.exports = {
    searchJobs
};