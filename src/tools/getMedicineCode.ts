import { ToolConfig } from './allTools.js';

interface GetMedicineCodeArgs {
    drugName: string;
}

interface FDAResponse {
    results: {
        product_ndc: string;
        generic_name: string;
        brand_name: string;
    }[];
    meta: {
        disclaimer: string;
        terms: string;
        license: string;
        last_updated: string;
        results: {
            skip: number;
            limit: number;
            total: number;
        };
    };
}

export const getMedicineCodeTool: ToolConfig<GetMedicineCodeArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_medicine_code',
            description: 'Get the NDC code for a given medicine name from FDA database',
            parameters: {
                type: 'object',
                properties: {
                    drugName: {
                        type: 'string',
                        description: 'The name of the medicine to look up',
                    }
                },
                required: ['drugName']
            }
        }
    },
    handler: async ({ drugName }) => {
        return await getMedicineCode(drugName);
    }
};

async function getMedicineCode(drugName: string): Promise<string> {
    const baseUrl = 'https://api.fda.gov/drug/ndc.json';
    const query = encodeURIComponent(`generic_name:"${drugName}" OR brand_name:"${drugName}"`);
    const url = `${baseUrl}?search=${query}&limit=1`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`No NDC code found for medicine: ${drugName}`);
            }
            throw new Error(`FDA API request failed with status: ${response.status}`);
        }

        const data: FDAResponse = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].product_ndc;
        } else {
            throw new Error(`No NDC code found for medicine: ${drugName}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch NDC code: ${error.message}`);
        }
        throw new Error('An unknown error occurred while fetching the NDC code');
    }
} 