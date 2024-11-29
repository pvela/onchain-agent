import { ToolConfig } from './allTools.js';

interface GetBalanceArgs {
    wallet: string;
}

export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_balance',
            description: 'Get the balance of a wallet',
            parameters: {
                type: 'object',
                properties: {
                    wallet: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The wallet address to get the balance of',
                    }
                },
                required: ['wallet']
            }
        }
    },
    handler: async ({ wallet }) => {
        // Implement actual balance checking logic here
        return '69420';
    }
};
