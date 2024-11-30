import { Address } from 'viem';
import { ToolConfig } from './allTools.js';
import fetch from 'node-fetch';

interface GetContractAbiArgs {
    contract: Address;
}

export const getContractAbiTool: ToolConfig<GetContractAbiArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_contract_abi',
            description: 'Get the ABI of a deployed contract from the block explorer',
            parameters: {
                type: 'object',
                properties: {
                    contract: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The contract address to get the ABI from',
                    }
                },
                required: ['contract']
            }
        }
    },
    handler: async ({ contract }) => {
        return await getContractAbi(contract);
    }
};

async function getContractAbi(contract: Address) {
    const BLOCK_EXPLORER_API = 'https://block-explorer-api.testnet.abs.xyz';
    const url = `${BLOCK_EXPLORER_API}/api?module=contract&action=getabi&address=${contract}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1') {
            return data.result;
        }
        return `Contract ABI not found or contract not verified`;
    } catch (error) {
        return `Error fetching ABI: ${error instanceof Error ? error.message : String(error)}`;
    }
}
