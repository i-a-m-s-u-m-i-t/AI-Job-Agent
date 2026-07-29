const fs = require("fs");
const {
    detectApplyButton,
    openApplication
} = require("./apply");

async function enrichJobs(context) {

    const jobs = JSON.parse(
        fs.readFileSync("./data/jobs.json", "utf8")
    );

    console.log(`Processing ${jobs.length} jobs...\n`);

    // Process only first 3 jobs while testing
    const limit = 15;

    for (let i = 0; i < limit; i++) {

        console.log(`Opening Job ${i + 1}`);

        const page = await context.newPage();

        try {

            await page.goto(jobs[i].link, {
                waitUntil: "networkidle",
                timeout: 60000
            });

            await page.waitForTimeout(3000);

            const bodyText = await page.locator("body").innerText();

            jobs[i].description = bodyText;

            const apply = await detectApplyButton(page);

            jobs[i].applyAvailable = apply.found;
            jobs[i].applyButtonText = apply.text;

            if (apply.found) {

                const opened = await openApplication(page);

                jobs[i].applicationOpened = opened;
            }

            console.log("Description extracted.");

        } catch (err) {

            console.log("================================");
            console.log("ERROR OPENING JOB");
            console.log(err);
            console.log("================================");

            jobs[i].description = "";

        }

        await page.close();

    }

    fs.writeFileSync(
        "./data/jobs.json",
        JSON.stringify(jobs, null, 2)
    );

    console.log("\njobs.json updated successfully.");

}

module.exports = {
    enrichJobs
};