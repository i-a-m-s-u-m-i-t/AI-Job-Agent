const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const profile = require("./profile.json");
const prompt = fs.readFileSync("./ai/prompt.txt","utf8");

async function getAIAnswer(question){

    const response = await client.chat.completions.create({

        model:"gpt-4.1-mini",

        messages:[

            {
                role:"system",
                content:prompt
            },

            {
                role:"user",
                content:
                JSON.stringify(profile,null,2)
                +
                "\n\nQuestion:\n"
                +
                question
            }

        ],

        temperature:0

    });

    return response.choices[0].message.content.trim();

}

module.exports={
    getAIAnswer
};