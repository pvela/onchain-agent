import { ChatCompletionTool } from 'openai/resources/chat/completions';
import { getBalanceTool } from './get-balance.js';

export type ToolHandler = (args: Record<string, any>) => Promise<string> | string;

export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
                required: string[];
            };
        };
    };
    handler: (args: T) => Promise<string | number | bigint>;
}

export const tools: Record<string, ToolConfig> = {
    get_balance: getBalanceTool,
    // Add more tools here...
};
