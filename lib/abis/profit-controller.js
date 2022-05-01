"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profitEvents = void 0;
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const abi_1 = require("@ethersproject/abi");
const profit_controller_json_1 = __importDefault(require("./profit-controller.json"));
const LOG_EVENT_STRING = "LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)";
const abi = new abi_1.Interface(profit_controller_json_1.default);
const convertFragment = abi.getEvent("LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)");
exports.profitEvents = {
    "LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)": {
        topic: abi.getEventTopic("LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"),
        decode(data) {
            const result = abi.decodeEventLog(convertFragment, data.data || "", data.topics);
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
            };
        }
    }
};
//# sourceMappingURL=profit-controller.js.map