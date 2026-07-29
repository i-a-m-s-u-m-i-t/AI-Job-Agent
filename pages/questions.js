const profile = require("../ai/profile.json");

async function answerScreeningQuestion(page) {

    try {

        console.log("Starting screening...");

        let previousQuestion = "";

        while (true) {

            await page.waitForTimeout(2000);

            const botMessages = page.locator(".botMsg");

            if (await botMessages.count() === 0) {
                console.log("No chatbot found.");
                break;
            }

            const question = (
                await botMessages.last().innerText()
            ).trim();

            if (!question) break;

            if (question === previousQuestion) {

                await page.waitForTimeout(2000);

                const latest = (
                    await botMessages.last().innerText()
                ).trim();

                if (latest === previousQuestion) {
                    console.log("No more questions.");
                    break;
                }

                previousQuestion = latest;

            } else {

                previousQuestion = question;
            }

            console.log("\n==============================");
            console.log("Question:");
            console.log(previousQuestion);

            const { getAIAnswer } = require("../ai/aiAnswer");

            const answer = await getAIAnswer(question);

            console.log("Answer:", answer);

            //-------------------------------------------------------
            // TEXT INPUT
            //-------------------------------------------------------

            const input = page.locator('[contenteditable="true"]:visible').last();

            if (await input.count()) {

                await input.click();

                await page.keyboard.press("Meta+A").catch(() => {});
                await page.keyboard.press("Control+A").catch(() => {});
                await page.keyboard.press("Backspace");

                await page.keyboard.type(answer, {
                    delay: 40
                });

            }

            //-------------------------------------------------------
            // CHECKBOX
            //-------------------------------------------------------

            else if (await page.locator('input[type="checkbox"]').count()) {

                console.log("Checkbox question detected.");

                const label = page.locator(`label[for="${answer}"]`);

                if (await label.count()) {

                    await label.first().click({
                        force: true
                    });

                    console.log("Selected:", answer);

                } else {

                    const textLabel = page.getByText(answer, {
                        exact: true
                    });

                    if (await textLabel.count()) {

                        await textLabel.first().click({
                            force: true
                        });

                        console.log("Selected:", answer);

                    } else {

                        console.log("Checkbox option not found.");

                    }
                }

            }

            //-------------------------------------------------------
            // RADIO
            //-------------------------------------------------------

            else if (await page.locator('input[type="radio"]').count()) {

                console.log("Radio question detected.");

                const label = page.locator(`label[for="${answer}"]`);

                if (await label.count()) {

                    await label.first().click({
                        force: true
                    });

                } else {

                    const option = page.getByText(answer, {
                        exact: true
                    });

                    if (await option.count()) {

                        await option.first().click({
                            force: true
                        });

                    } else {

                        console.log("Radio option not found.");

                    }
                }

            }

            //-------------------------------------------------------
            // SAVE
            //-------------------------------------------------------

            const saveButton = page.locator(".sendMsg").last();

            await saveButton.waitFor({
                state: "visible",
                timeout: 5000
            });

            await page.waitForTimeout(1000);

            await saveButton.click({
                force: true
            });

            console.log("Saved.");

            await page.waitForTimeout(3000);

        }

        console.log("\nScreening completed.");

    }

    catch (err) {

        console.log(err);

    }

}

function getAnswer(question) {

    question = question.toLowerCase();

    // ---------------- CITY ----------------

    if (
        question.includes("city") ||
        question.includes("currently residing") ||
        question.includes("relocate to")
    )
        return profile.location;

    // ---------------- TRAVEL ----------------

    if (question.includes("passport"))
        return profile.passport;

    if (question.includes("travel"))
        return profile.travelOnsite;

    if (question.includes("onsite"))
        return profile.travelOnsite;

    if (question.includes("relocate"))
        return profile.relocate;

    // ---------------- EXPERIENCE ----------------

    if (question.includes("playwright"))
        return String(profile.playwrightExperience);

    if (question.includes("javascript"))
        return String(profile.javascriptExperience);

    if (question.includes("typescript"))
        return String(profile.typescriptExperience);

    if (question.includes("python"))
        return profile.pythonExperience;

    if (question.includes("api"))
        return String(profile.apiExperience);

    if (question.includes("postman"))
        return String(profile.apiExperience);

    if (question.includes("aws"))
        return String(profile.awsExperience);

    if (question.includes("kafka"))
        return String(profile.kafkaExperience);

    if (question.includes("automation"))
        return String(profile.totalExperience);

    if (question.includes("manual"))
        return String(profile.totalExperience);

    if (question.includes("testing"))
        return String(profile.totalExperience);

    // ---------------- DOMAIN ----------------

    if (question.includes("core banking"))
        return "0";

    if (question.includes("banking"))
        return "0";

    if (question.includes("insurance"))
        return "0";

    // ---------------- HR ----------------

    if (question.includes("notice"))
        return profile.noticePeriod;

    if (question.includes("join"))
        return profile.noticePeriod;

    if (question.includes("current ctc"))
        return profile.currentCTC;

    if (question.includes("expected ctc"))
        return profile.expectedCTC;

    if (question.includes("salary"))
        return profile.expectedCTC;

    if (question.includes("location"))
        return profile.location;

    if (question.includes("shift"))
        return "Yes";

    if (question.includes("hybrid"))
        return "Yes";

    if (question.includes("work from office"))
        return "Yes";

    if (question.includes("experience"))
        return String(profile.totalExperience);

    return "Yes";
}

module.exports = {
    answerScreeningQuestion
};