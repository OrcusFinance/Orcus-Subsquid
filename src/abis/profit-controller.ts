/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Interface } from "@ethersproject/abi";
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import profitControllerAbi from "./profit-controller.json";

const LOG_EVENT_STRING = "LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)";

const abi = new Interface(profitControllerAbi);

export interface ConvertEvent {
    oruFromFarm: bigint,
    usdcFromArb: bigint,
    oruFromArb: bigint,
    ousdFromFee: bigint,
    usdcFromFee: bigint,
    oruFromFee: bigint,
    wastrFromInvest: bigint,
    usdcFromInvest: bigint,
    oruFromInvest: bigint,
    totalOru: bigint
}

const convertFragment = abi.getEvent("LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)");

export const profitEvents = {
    "LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)": {
        topic: abi.getEventTopic("LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"),
        decode(data: EvmLogHandlerContext): ConvertEvent {
            const result = abi.decodeEventLog(
                convertFragment,
                data.data || "",
                data.topics
            );
            return {
                oruFromFarm: result[0],
                usdcFromArb: result[1],
                oruFromArb: result[2],
                ousdFromFee: result[3],
                usdcFromFee: result[4],
                oruFromFee: result[5],
                wastrFromInvest: result[6],
                usdcFromInvest: result[7],
                oruFromInvest: result[8],
                totalOru: result[9]
            }
        }
    }
};