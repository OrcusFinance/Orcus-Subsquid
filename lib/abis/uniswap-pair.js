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
const uniswap_pair_json_1 = __importDefault(require("./uniswap-pair.json"));
const abi = new abi_1.Interface(uniswap_pair_json_1.default);
const mintFragment = abi.getEvent("Mint(address indexed sender, uint amount0, uint amount1)");
const burnFragment = abi.getEvent("Burn(address indexed sender, uint amount0, uint amount1, address indexed to)");
exports.events = {
    "Mint(address indexed sender, uint amount0, uint amount1)": {
        topic: abi.getEventTopic("Mint(address indexed sender, uint amount0, uint amount1)"),
        decode(data) {
            const result = abi.decodeEventLog(mintFragment, data.data || "", data.topics);
            return {
                amount0: result[1],
                amount1: result[2]
            };
        }
    },
    "Burn(address indexed sender, uint amount0, uint amount1, address indexed to)": {
        topic: abi.getEventTopic("Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"),
        decode(data) {
            const result = abi.decodeEventLog(burnFragment, data.data || "", data.topics);
            return {
                amount0: result[1],
                amount1: result[2]
            };
        }
    }
};
//# sourceMappingURL=uniswap-pair.js.map