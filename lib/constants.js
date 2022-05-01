"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRACT_INSTANCE = exports.PROVIDER = exports.CONTRACT_TOTAL_SUPPLY = exports.CONTRACT_SYMBOL = exports.CONTRACT_NAME = exports.API_RETRIES = exports.BATCH_SIZE = exports.ARCHIVE = exports.CHAIN_NODE = exports.PROFIT_CONTROLLER = exports.OUSD_ORU_PAIR = exports.OUSD_USDC_PAIR = exports.ORU_USDC_PAIR = exports.CONTRACT_ADDRESS = void 0;
const ethers_1 = require("ethers");
const erc20_json_1 = __importDefault(require("./abis/erc20.json"));
exports.CONTRACT_ADDRESS = "0xCdB32eEd99AA19D39e5d6EC45ba74dC4afeC549F".toLowerCase();
exports.ORU_USDC_PAIR = "0x43783EcE7b46BB026D4CeBfd3e29f539Ff1914fB".toLowerCase();
exports.OUSD_USDC_PAIR = "0xCf83a3d83c1265780d9374e8a7c838fE22BD3DC6".toLowerCase();
exports.OUSD_ORU_PAIR = "0xE5A11AfBed6a0fC59e69493F7142ef7e454e809f".toLowerCase();
exports.PROFIT_CONTROLLER = "0x17b6c54EF3d64FA100067e60Fd69878291C9e592".toLowerCase();
// API constants
exports.CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
exports.ARCHIVE = "http://localhost:4010";
exports.BATCH_SIZE = 500;
exports.API_RETRIES = 5;
// From contract
exports.CONTRACT_NAME = "Orcus Token";
exports.CONTRACT_SYMBOL = "ORU";
exports.CONTRACT_TOTAL_SUPPLY = 1000n;
// ethers contract
exports.PROVIDER = new ethers_1.ethers.providers.WebSocketProvider(exports.CHAIN_NODE);
exports.CONTRACT_INSTANCE = new ethers_1.ethers.Contract(exports.CONTRACT_ADDRESS, erc20_json_1.default, exports.PROVIDER);
//# sourceMappingURL=constants.js.map