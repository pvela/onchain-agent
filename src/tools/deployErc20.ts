import { ToolConfig } from './allTools.js';
import { createViemWalletClient } from '../viem/createViemWalletClient.js';
import { ERC20_ABI, ERC20_BYTECODE } from '../const/contractDetails.js';

export const deployErc20Tool: ToolConfig = {
    definition: {
        type: 'function',
        function: {
            name: 'deploy_erc20',
            description: 'Deploy a new ERC20 token contract',
            parameters: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the token'
                    },
                    symbol: {
                        type: 'string',
                        description: 'The symbol of the token'
                    },
                    initialSupply: {
                        type: 'string',
                        description: 'The initial supply of tokens (in wei)'
                    }
                },
                required: ['name', 'symbol', 'initialSupply']
            }
        }
    },
    handler: async (args: { name: string, symbol: string, initialSupply: string }) => {
        const walletClient = createViemWalletClient();

        const hash = await walletClient.deployContract({
            account: walletClient.account,
            abi: ERC20_ABI,
            bytecode: ERC20_BYTECODE,
            args: [args.name, args.symbol, BigInt(args.initialSupply)]
        });

        return hash;
    }
};