import 'dotenv/config';
import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant.js';
import { createThread } from './openai/createThread.js';
import { createRun } from './openai/createRun.js';
import { performRun } from './openai/performRun.js';

const client = new OpenAI();

async function main() {
    const assistant = await createAssistant(client);
    const thread = await createThread(client,
        `Hey, mint an NFT on this smart contract 0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA. 
        I don't have the ABI but here is the mint function signature: function mint(address to, uint256 qty) external;
        I want to mint 1 NFT to my wallet.`);
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);
    console.log(result);
}

main();
