"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const abi_1 = require("@ethersproject/abi");
const erc20_json_1 = __importDefault(require("./erc20.json"));
const abi = new abi_1.Interface(erc20_json_1.default);
const transferFragment = abi.getEvent("Transfer(address,address,uint256)");
exports.events = {
    "Transfer(address,address,uint256)": {
        topic: abi.getEventTopic("Transfer(address,address,uint256)"),
        decode(data) {
            const result = abi.decodeEventLog(transferFragment, data.data || "", data.topics);
            return {
                from: result[0],
                to: result[1],
                value: result[2].toBigInt(),
            };
        },
    },
};
//# sourceMappingURL=erc20.js.map