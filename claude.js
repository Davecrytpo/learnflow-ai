import fs from "fs";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = process.argv.slice(2).join(" ");

async function run() {
  if (!prompt) {
    console.log("Please provide a task.");
    return;
  }

  const files = fs.readdirSync(process.cwd());

  const response = await anthropic.messages.create({
    model: "claude-4",
    max_tokens: 50000,
    messages: [
      {
        role: "user",
        content: \
You are a senior full-stack engineer.

Project files in current folder:
\

Task:
\

Generate production-ready code, respond clearly and accurately.
\
      }
    ],
  });

  console.log(response.content[0].text);
}

run();
