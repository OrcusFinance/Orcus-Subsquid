"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tvlDecLogsHandler = exports.tvlIncLogsHandler = exports.contractLogsHandler = exports.profitLogHanlder = void 0;
const model_1 = require("../model");
const uniswap_pair_json_1 = __importDefault(require("../abis/uniswap-pair.json"));
const erc721 = __importStar(require("../abis/erc20"));
const pair = __importStar(require("../abis/uniswap-pair"));
const profit = __importStar(require("../abis/profit-controller"));
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
async function profitLogHanlder(ctx) {
    const convert = profit.profitEvents["LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"].decode(ctx);
    const jsonProvider = new ethers_1.ethers.providers.JsonRpcProvider("https://astar-api.bwarelabs.com/a43f0389-2bf7-44bc-905a-6922bfa3d87b");
    const oruPair = new ethers_1.ethers.Contract(constants_1.ORU_USDC_PAIR, uniswap_pair_json_1.default, jsonProvider);
    const reserves = await oruPair.getReserves();
    const oruPrice = (+reserves[0] / 1e6) / (+reserves[1] / 1e18);
    await ctx.store.save(new model_1.ProfitManagerItem({
        id: ctx.txHash,
        timestamp: BigInt(ctx.substrate.block.timestamp),
        oruFromFee: Number(convert.oruFromFee) / 1e18,
        usdcFromInvest: Number(convert.usdcFromInvest) / 1e6,
        oruArbitrager: Number(convert.oruFromArb) / 1e18,
        oruPenalty: Number(convert.oruFromFarm) / 1e18,
        totalInOru: Number(convert.totalOru) / 1e18,
        totalInUsd: (Number(convert.totalOru) / 1e18) * oruPrice
    }));
}
exports.profitLogHanlder = profitLogHanlder;
async function contractLogsHandler(ctx) {
    const transfer = erc721.events["Transfer(address,address,uint256)"].decode(ctx);
    console.log("We are here!");
    console.log(transfer);
    let from = transfer.from;
    let to = transfer.to;
    await ctx.store.save(new model_1.Transfer({
        id: ctx.txHash,
        from,
        to
    }));
}
exports.contractLogsHandler = contractLogsHandler;
async function tvlIncLogsHandler(ctx) {
    const tvlChartId = ctx.txHash;
    const pairAddress = ctx.contractAddress;
    const mint = pair.events["Mint(address indexed sender, uint amount0, uint amount1)"].decode(ctx);
    let amt0 = 1;
    let amt1 = 1;
    let price0 = 1;
    let price1 = 1;
    if (pairAddress === constants_1.ORU_USDC_PAIR) {
        amt0 = Number(mint.amount0) / 1e6;
        amt1 = Number(mint.amount1) / 1e18;
        price0 = 1;
        price1 = amt0 / amt1;
        console.log("AMT0: " + mint.amount0.toString());
        console.log("AMT1: " + mint.amount1.toString());
        console.log("OUSD USDC PAIR price + " + price1);
        console.log("TVL: " + ((amt0 * price0) + (amt1 * price1)));
    }
    else if (pairAddress === constants_1.OUSD_USDC_PAIR) {
        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e6;
        price0 = amt1 / amt0;
        price1 = 1;
        console.log("OUSD USDC PAIR price + " + price0);
    }
    else if (pairAddress === constants_1.OUSD_ORU_PAIR) {
        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e18;
        price0 = 1; // ORU price ~0.08
        price1 = amt0 / amt1; // Theoriticall our stable coin costs 1
        console.log(`AMT0 ${amt0}`);
        console.log(`AMT1 ${amt1}`);
        console.log(`Theo TVL: ${(amt0 * price0) + (amt1 * price1)}`);
    }
    // FIXME: in Case of USDC
    let tvlValue = (amt0 * price0) + (amt1 * price1);
    const charts = await ctx.store.getRepository(model_1.TVLChart);
    const chartsLength = await charts.count();
    if (chartsLength !== 0) {
        const lastChart = await charts.find({ id: (chartsLength - 1).toString() });
        const newTvlValue = (tvlValue) + (+(lastChart[0].value));
        const diffTime = Number(lastChart[0].endTimestamp) - Number(ctx.substrate.block.timestamp);
        console.log(`End time ${Number(lastChart[0].endTimestamp)}`);
        console.log(`Current time ${Number(ctx.substrate.block.timestamp)}`);
        console.log(diffTime);
        // 24h not pass updating last value
        if (diffTime > 0) {
            await ctx.store.save(new model_1.TVLChart({
                id: lastChart[0].id,
                currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                endTimestamp: BigInt(lastChart[0].endTimestamp),
                value: newTvlValue
            }));
        }
        // 24h pass creating new entry
        else {
            console.log("Creating new entry!");
            await ctx.store.save(new model_1.TVLChart({
                id: (chartsLength).toString(),
                currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                endTimestamp: BigInt(Number(ctx.substrate.block.timestamp) + (21600 * 1000)),
                value: newTvlValue
            }));
        }
    }
    else {
        await ctx.store.save(new model_1.TVLChart({
            id: (chartsLength).toString(),
            currentTimestamp: BigInt(ctx.substrate.block.timestamp),
            endTimestamp: BigInt(ctx.substrate.block.timestamp + (21600 * 1000)),
            value: tvlValue
        }));
    }
}
exports.tvlIncLogsHandler = tvlIncLogsHandler;
async function tvlDecLogsHandler(ctx) {
    const tvlChartId = ctx.txHash;
    const pairAddress = ctx.contractAddress;
    const mint = pair.events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].decode(ctx);
    let amt0 = 1;
    let amt1 = 1;
    let price0 = 1;
    let price1 = 1;
    if (pairAddress === constants_1.ORU_USDC_PAIR) {
        amt0 = Number(mint.amount0) / 1e6;
        amt1 = Number(mint.amount1) / 1e18;
        price0 = 1;
        price1 = amt0 / amt1;
        console.log("AMT0: " + mint.amount0.toString());
        console.log("AMT1: " + mint.amount1.toString());
        console.log("OUSD USDC PAIR price + " + price1);
        console.log("TVL: " + ((amt0 * price0) + (amt1 * price1)));
    }
    else if (pairAddress === constants_1.OUSD_USDC_PAIR) {
        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e6;
        price0 = amt1 / amt0;
        price1 = 1;
        console.log("OUSD USDC PAIR price + " + price0);
    }
    else if (pairAddress === constants_1.OUSD_ORU_PAIR) {
        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e18;
        price0 = 1;
        price1 = amt0 / amt1; // Theoriticall our stable coin costs 1
    }
    // FIXME: in Case of USDC
    let tvlValue = (amt0 * price0) + (amt1 * price1);
    const charts = await ctx.store.getRepository(model_1.TVLChart);
    const chartsLength = await charts.count();
    const lastChart = await charts.find({ id: (chartsLength - 1).toString() });
    const newTvlValue = (+(lastChart[0].value)) - (tvlValue);
    const diffTime = Number(lastChart[0].endTimestamp) - Number(ctx.substrate.block.timestamp);
    console.log(`End time ${Number(lastChart[0].endTimestamp)}`);
    console.log(`Current time ${Number(ctx.substrate.block.timestamp)}`);
    console.log(diffTime);
    // 24h not pass updating last value
    if (diffTime > 0) {
        await ctx.store.save(new model_1.TVLChart({
            id: lastChart[0].id,
            currentTimestamp: BigInt(ctx.substrate.block.timestamp),
            endTimestamp: BigInt(lastChart[0].endTimestamp),
            value: newTvlValue
        }));
    }
    // 24h pass creating new entry
    else {
        console.log("Creating new entry!");
        await ctx.store.save(new model_1.TVLChart({
            id: (chartsLength).toString(),
            currentTimestamp: BigInt(ctx.substrate.block.timestamp),
            endTimestamp: BigInt(Number(ctx.substrate.block.timestamp) + (21600 * 1000)),
            value: newTvlValue
        }));
    }
}
exports.tvlDecLogsHandler = tvlDecLogsHandler;
//# sourceMappingURL=events.js.map