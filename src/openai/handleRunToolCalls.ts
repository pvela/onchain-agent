import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

export async function handleRunToolCalls(run: Run, client: OpenAI, thread: Thread): Promise<Run> {
    if (
        run.required_action?.submit_tool_outputs?.tool_calls
    ) {
        const toolOutputs = run.required_action.submit_tool_outputs.tool_calls
            .map((tool) => {
                if (tool.function.name === "get_balance") {
                    return {
                        tool_call_id: tool.id,
                        output: "69420", // TODO: Implement this
                    };
                }
                return null;
            }).filter((output): output is { tool_call_id: string; output: string } => output !== null);

        if (toolOutputs.length > 0) {
            return await client.beta.threads.runs.submitToolOutputsAndPoll(
                thread.id,
                run.id,
                { tool_outputs: toolOutputs },
            );
        }
    }
    return run;
}
