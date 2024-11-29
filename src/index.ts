import 'dotenv/config';
import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant.js';
import { createThread } from './openai/createThread.js';
import { createRun } from './openai/createRun.js';
import { performRun } from './openai/performRun.js';

const client = new OpenAI();

async function main() {
    const assistant = await createAssistant(client);
    const thread = await createThread(client, "Hey how you doin?");
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);
    console.log(result);
}

main();
