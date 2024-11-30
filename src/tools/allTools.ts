import { getBalanceTool } from './getBalance.js';
import { getContractBytecodeTool } from './getContractBytecode.js';
import { getWalletAddressTool } from './getWalletAddress.js';
import { readContractTool } from './readContract.js';
import { sendTransactionTool } from './sendTransaction.js';
import { writeContractTool } from './writeContract.js';
import { getContractAbiTool } from './getContractAbi.js';

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
    handler: (args: T) => Promise<string | number | bigint | boolean | object>;
}

export const tools: Record<string, ToolConfig> = {
    // == READ == \\
    get_balance: getBalanceTool,
    get_wallet_address: getWalletAddressTool,
    get_contract_bytecode: getContractBytecodeTool,
    get_contract_abi: getContractAbiTool,
    read_contract: readContractTool,

    // == WRITE == \\
    send_transaction: sendTransactionTool,
    write_contract: writeContractTool,


    // Add more tools here...
};
