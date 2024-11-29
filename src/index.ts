import 'dotenv/config';
import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant.js';
import { createThread } from './openai/createThread.js';
import { createRun } from './openai/createRun.js';
import { performRun } from './openai/performRun.js';

const client = new OpenAI();

async function main() {
    const assistant = await createAssistant(client);
    const thread = await createThread(client, "Hey, send 0.001 ETH to 0x273B3527BF5b607dE86F504fED49e1582dD2a1C6");
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);
    console.log(result);
}

main();
