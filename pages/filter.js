function shouldSkipJob(job) {

    const title = (job.title || "").toLowerCase();
    const description = (job.description || "").toLowerCase();

    const skipKeywords = [
        "c#",
        ".net",
        "core banking",
        "sap",
        "guidewire",
        "mainframe",
        "ios",
        "android",
        "flutter"
    ];

    for (const word of skipKeywords) {
        if (
            title.includes(word) ||
            description.includes(word)
        ) {
            return {
                skip: true,
                reason: word
            };
        }
    }

    return {
        skip: false
    };
}

module.exports = {
    shouldSkipJob
};