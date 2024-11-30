import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { tools } from '../tools/allTools.js';

export async function handleRunToolCalls(run: Run, client: OpenAI, thread: Thread): Promise<Run> {
    if (run.required_action?.submit_tool_outputs?.tool_calls) {
        const toolOutputs = await Promise.all(
            run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
                const toolConfig = tools[tool.function.name];

                console.log(`💾 [Alt] Executing: ${tool.function.name} | Connection stable.`);

                if (!toolConfig) throw new Error(`Tool ${tool.function.name} not found. Exiting out.`);

                try {
                    const args = JSON.parse(tool.function.arguments) as Parameters<typeof toolConfig.handler>[0];
                    const output = await toolConfig.handler(args);
                    return {
                        tool_call_id: tool.id,
                        output: output.toString(),
                    };
                } catch (error) {
                    console.error(`Error executing tool ${tool.function.name}:`, error);
                    return {
                        tool_call_id: tool.id,
                        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    };
                }
            })
        );

        const validOutputs = toolOutputs.filter((output): output is { tool_call_id: string; output: string } => output !== null);

        if (validOutputs.length > 0) {
            return await client.beta.threads.runs.submitToolOutputsAndPoll(
                thread.id,
                run.id,
                { tool_outputs: validOutputs },
            );
        }
    }
    return run;
}
