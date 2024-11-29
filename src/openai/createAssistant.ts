import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";

export async function createAssistant(client: OpenAI): Promise<Assistant> {
    return await client.beta.assistants.create({
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
}
