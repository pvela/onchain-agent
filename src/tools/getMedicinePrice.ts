import { ToolConfig } from './allTools.js';
import { createViemPublicClient } from '../viem/createViemPublicClient.js';
import { PBMFreeContract_ABI } from '../const/contractDetails.js';

export const getMedicinePriceTool: ToolConfig = {
    definition: {
        type: 'function',
        function: {
            name: 'get_medicine_price',
            description: 'Get the price of a medicine product from the PBM contract',
            parameters: {
                type: 'object',
                properties: {
                    contractAddress: {
                        type: 'string',
                        description: 'The address of the PBM contract'
                    },
                    productId: {
                        type: 'string',
                        description: 'The ID of the medicine product'
                    }
                },
                required: ['contractAddress', 'productId']
            }
        }
    },
    handler: async (args: { contractAddress: string, productId: string }) => {
        const publicClient = createViemPublicClient();

        const price = await publicClient.readContract({
            address: args.contractAddress as `0x${string}`,
            abi: PBMFreeContract_ABI,
            functionName: 'getProductPrice',
            args: [args.productId]
        });

        return `The price of product ${args.productId} is ${price} wei`;
    }
    
}; 