import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { handleRunToolCalls } from "./handleRunToolCalls.js";

export async function performRun(run: Run, client: OpenAI, thread: Thread) {
    while (run.status === "requires_action" ||
        run.status === "in_progress" ||
        run.status === "queued") {

        if (run.status === "requires_action") {
            run = await handleRunToolCalls(run, client, thread);
        }

        if (run.status === "in_progress" || run.status === "queued") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            run = await client.beta.threads.runs.retrieve(thread.id, run.id);
        }
    }

    if (run.status === "completed") {
        const messages = await client.beta.threads.messages.list(thread.id);
        return messages.data[0].content[0];
    }

    console.error(`Run failed with status: ${run.status}`);
    throw new Error(`Run failed with status: ${run.status}`);
}
