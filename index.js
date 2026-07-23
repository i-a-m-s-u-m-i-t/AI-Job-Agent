const { startNaukri } = require("./pages/naukri");

(async () => {
    try {
        await startNaukri();
    } catch (error) {
        console.error(error);
    }
})();
