async function takeScreenshot(page, name) {

    await page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: true
    });

    console.log(`Screenshot saved: ${name}.png`);
}

module.exports = {
    takeScreenshot
};