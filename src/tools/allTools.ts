import { getBalanceTool } from './get-balance.js';
import { sendTransactionTool } from './sendTransaction.js';
import { writeContractTool } from './writeContract.js';

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
    send_transaction: sendTransactionTool,
    write_contract: writeContractTool,
    // Add more tools here...
};
