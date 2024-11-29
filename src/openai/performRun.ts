import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { handleRunToolCalls } from "./handleRunToolCalls.js";

export async function performRun(run: Run, client: OpenAI, thread: Thread) {
    if (run.status === "requires_action") {
        run = await handleRunToolCalls(run, client, thread);
    }

    if (run.status === "completed") {
        const messages = await client.beta.threads.messages.list(thread.id);
        return messages.data[0].content[0];
    }

    throw new Error(`Run failed with status: ${run.status}`);
}
