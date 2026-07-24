const { answerScreeningQuestion } = require("./questions");

const { takeScreenshot } = require("../utils/screenshot");

async function detectApplyButton(page) {

    const applyButton = page.getByRole("button", {
        name: /^Apply$|^Apply Now$/i
    });

    const count = await applyButton.count();

    console.log(`Found ${count} Apply button(s).`);

    if (count > 0) {

        return {
            found: true,
            text: await applyButton.first().innerText()
        };
    }

    return {
        found: false,
        text: ""
    };
}

async function openApplication(page) {

    try {

        const applyButton = page.getByRole("button", {
            name: /^Apply$|^Apply Now$/i
        });

        await applyButton.first().waitFor({
            state: "visible",
            timeout: 10000
        });

        console.log("Apply button is visible.");

        await applyButton.first().scrollIntoViewIfNeeded();
        await applyButton.first().hover();

        const html = await applyButton.first().evaluate(el => el.outerHTML);

        console.log("\n========== APPLY BUTTON HTML ==========");
        console.log(html);
        console.log("=======================================\n");

        console.log("Clicking Apply...");

        await Promise.all([
            applyButton.first().click(),
            page.waitForLoadState("networkidle").catch(() => {})
        ]);

        console.log("Waiting for UI update...");
        await page.waitForTimeout(3000);

        console.log("Current URL:", page.url());

        // Show all buttons after click
        const buttonTexts = await page.locator("button").allInnerTexts();

        console.log("\n========== BUTTONS AFTER CLICK ==========");
        console.log(buttonTexts);
        console.log("=========================================\n");

        // Show inputs/textareas
        const inputCount = await page.locator("input, textarea").count();
        console.log("Inputs found:", inputCount);

        // Show frames
        console.log("\n========== FRAMES ==========");
        page.frames().forEach((frame, index) => {
            console.log(index, frame.url());
        });
        console.log("============================\n");

        await takeScreenshot(page, "after_apply");

        await answerScreeningQuestion(page);

        return true;

    } catch (err) {

        console.log("Error while clicking Apply:");
        console.log(err);

        return false;
    }
}
module.exports = {
    detectApplyButton,
    openApplication
};