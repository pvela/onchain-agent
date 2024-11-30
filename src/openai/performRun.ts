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


    if (run.status === 'failed') {
        console.error('Run failed:', run.last_error);
        await client.beta.threads.messages.create(thread.id, {
            role: 'assistant',
            content: `I encountered an error: ${run.last_error?.message || 'Unknown error'}`
        });
    }

    const messages = await client.beta.threads.messages.list(thread.id);

    const assistantMessage = messages.data.find(message => message.role === 'assistant');
    if (!assistantMessage) {
        if (run.status === 'failed') {
            return {
                type: 'text',
                text: {
                    value: `Run failed: ${run.last_error?.message || 'Unknown error'}`,
                    annotations: []
                }
            };
        }
        return { type: 'text', text: { value: 'No response from assistant', annotations: [] } };
    }
    return assistantMessage.content[0];
}
