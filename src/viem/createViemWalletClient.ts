import { createWalletClient, http } from 'viem'
import { zksync } from 'viem/chains'
import { eip712WalletActions } from 'viem/zksync'

export function createViemWalletClient() {
    return createWalletClient({
        chain: zksync,
        transport: http()
    }).extend(eip712WalletActions());
}
