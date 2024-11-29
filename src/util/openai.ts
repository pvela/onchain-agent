import OpenAI from "openai";
import { Message } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

export async function handleRequiresAction(run: Run, client: OpenAI, thread: Thread): Promise<Message[]> {
    console.log("Handling requires action");

    // Check if there are tools that require outputs
    if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
    ) {

        console.log("Tool calls:", run.required_action.submit_tool_outputs.tool_calls);

        // Loop through each tool in the required action section
        const toolOutputs = run.required_action.submit_tool_outputs.tool_calls
            .map((tool) => {
                if (tool.function.name === "get_balance") {
                    return {
                        tool_call_id: tool.id,
                        output: "69420", // TODO: Implement this
                    };
                }
                return []; // Explicit return for unhandled cases
            }).filter((output): output is { tool_call_id: string; output: string } => output !== null);

        // Submit all tool outputs at once after collecting them in a list
        if (toolOutputs.length > 0) {
            run = await client.beta.threads.runs.submitToolOutputsAndPoll(
                thread.id,
                run.id,
                { tool_outputs: toolOutputs },
            );
            console.log("Tool outputs submitted successfully.");
        } else {
            console.log("No tool outputs to submit.");
        }

        // Check status after submitting tool outputs
        return handleRunStatus(run, client, thread);
    }
    console.log("No tool outputs to submit.");
    return []; // Add explicit return for when the if condition is false
};

export async function handleRunStatus(run: Run, client: OpenAI, thread: Thread): Promise<Message[]> {
    console.log("Handling run status");

    // Check if the run is completed
    if (run.status === "completed") {
        let messages = await client.beta.threads.messages.list(thread.id);

        // If you only want the latest message, it's the first one in the list
        console.log("Latest message:", messages.data[0].content[0]);

        // Return only the latest message in an array to maintain the return type
        return [messages.data[0]];
    } else if (run.status === "requires_action") {
        console.log(run.status);
        return await handleRequiresAction(run, client, thread);
    } else {
        console.error("Run did not complete:", run);
        return [];
    }
};
