/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Interface } from "@ethersproject/abi";
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import uniPair from "./uniswap-pair.json";

const abi = new Interface(uniPair);

export interface MintEvent {
    amount0: bigint,
    amount1: bigint
}

export interface BurnEvent {
    amount0: bigint,
    amount1: bigint
}

const mintFragment = abi.getEvent("Mint(address indexed sender, uint amount0, uint amount1)");
const burnFragment = abi.getEvent("Burn(address indexed sender, uint amount0, uint amount1, address indexed to)");

export const events = {
    "Mint(address indexed sender, uint amount0, uint amount1)": {
        topic: abi.getEventTopic("Mint(address indexed sender, uint amount0, uint amount1)"),
        decode(data: EvmLogHandlerContext): MintEvent {
            const result = abi.decodeEventLog(
                mintFragment,
                data.data || "",
                data.topics
            );
            return {
                amount0: result[1],
                amount1: result[2]
            }
        }
    },

    "Burn(address indexed sender, uint amount0, uint amount1, address indexed to)": {
        topic: abi.getEventTopic("Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"),
        decode(data: EvmLogHandlerContext): BurnEvent {
            const result = abi.decodeEventLog(
                burnFragment,
                data.data || "",
                data.topics
            );
            return {
                amount0: result[1],
                amount1: result[2]
            }
        }
    }
};