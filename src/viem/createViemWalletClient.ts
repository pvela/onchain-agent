import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abstractTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";

export function createViemWalletClient() {
    if (!process.env.PRIVATE_KEY) {
        throw new Error("⛔ PRIVATE_KEY environment variable is not set.");
    }

    //     else {
    //         console.log(`
    // ⚠️  WARNING: Private key detected in .env ⚠️
    // Only use wallets with funds you are willing to lose.
    // - Anyone with your private key can steal ALL your funds
    // - Never share it with anyone
    // - Never commit it to git`);
    //     }

    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

    return createWalletClient({
        account,
        chain: abstractTestnet,
        transport: http(),
    }).extend(eip712WalletActions());
}
