import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { tools } from '../tools/allTools.js';

export async function createAssistant(client: OpenAI): Promise<Assistant> {
    return await client.beta.assistants.create({
        model: "gpt-4",
        name: "Onchain Agent",
        instructions: `You are a helpful assistant that performs actions on the blockchain.
        
        You control a wallet connected to the Abstract Testnet blockchain.

        To get information about your own wallet, use the "get_wallet_address" tool.`,
        tools: Object.values(tools).map(tool => tool.definition)
    });
}
