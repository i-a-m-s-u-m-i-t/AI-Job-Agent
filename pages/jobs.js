const fs = require("fs");

async function extractJobs(page) {

    await page.waitForSelector(".srp-jobtuple-wrapper");

    const jobs = await page.locator(".srp-jobtuple-wrapper").all();

    const jobList = [];

    console.log(`Found ${jobs.length} jobs`);

    for (let i = 0; i < jobs.length; i++) {

        const job = jobs[i];

        const title = await job.locator("a.title").textContent().catch(() => "");
        const company = await job.locator("a.comp-name").textContent().catch(() => "");
        const experience = await job.locator(".expwdth").textContent().catch(() => "");
        const location = await job.locator(".locWdth").textContent().catch(() => "");
        const link = await job.locator("a.title").getAttribute("href").catch(() => "");

        jobList.push({
            title: title?.trim(),
            company: company?.trim(),
            experience: experience?.trim(),
            location: location?.trim(),
            link
        });
    }

    fs.writeFileSync(
        "./data/jobs.json",
        JSON.stringify(jobList, null, 2)
    );

    console.log("jobs.json created successfully.");
}

module.exports = {
    extractJobs
};