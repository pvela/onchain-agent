import 'dotenv/config';
import OpenAI from "openai";
import { handleRequiresAction } from './util/openai.js';

const client = new OpenAI();

async function main() {

    // Create the assistant
    const assistant = await client.beta.assistants.create({
        model: "gpt-4",
        name: "Onchain Agent",
        instructions: "You are a helpful assistant that performs actions on the blockchain.",
        tools: [
            {
                type: "function",
                function: {
                    name: "get_balance",
                    description: "Get the balance of a wallet",
                    parameters: {
                        type: "object",
                        properties: {
                            wallet: {
                                type: "string",
                                pattern: "^0x[a-fA-F0-9]{40}$",
                                description: "The wallet address to get the balance of",
                            }
                        },
                        required: ["wallet"]
                    }
                }
            }
        ]
    });

    // Create a thread
    const thread = await client.beta.threads.create();

    // Create a message in the thread
    await client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "What's the wallet balance of 0x742d35Cc6634C0532925a3b844f135bfc5Cca475?",
    });

    // Create a run
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id
    });

    // Wait for the run to complete or require action
    run = await client.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the run to complete and keep polling
    while (run.status === 'in_progress' || run.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // If the run requires action, handle it
    const result = await handleRequiresAction(run, client, thread);

    console.log(result);

}

main();
