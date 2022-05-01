/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  assertNotNull,
  EvmLogHandlerContext,
  Store,
} from "@subsquid/substrate-evm-processor";
import {Transfer, TVLChart, ProfitManagerItem} from "../model";
import pairABI from '../abis/uniswap-pair.json';
import * as erc721 from "../abis/erc20";
import * as pair from "../abis/uniswap-pair"
import * as profit from '../abis/profit-controller';
import {BigNumber, ethers} from "ethers";
import {ORU_USDC_PAIR, OUSD_ORU_PAIR, OUSD_USDC_PAIR} from "../constants";

export async function profitLogHanlder(
    ctx: EvmLogHandlerContext
): Promise<void> {

    const convert = profit.profitEvents["LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"].decode(ctx);

    const jsonProvider = new ethers.providers.JsonRpcProvider("https://astar-api.bwarelabs.com/a43f0389-2bf7-44bc-905a-6922bfa3d87b");
    const oruPair = new ethers.Contract(ORU_USDC_PAIR, pairABI, jsonProvider);

    const reserves = await oruPair.getReserves();
    const oruPrice = (+reserves[0] / 1e6) / (+reserves[1] / 1e18);

    await ctx.store.save(
        new ProfitManagerItem({
            id: ctx.txHash,
            timestamp: BigInt(ctx.substrate.block.timestamp),
            oruFromFee: Number(convert.oruFromFee) / 1e18,
            usdcFromInvest: Number(convert.usdcFromInvest) / 1e6,
            oruArbitrager: Number(convert.oruFromArb) / 1e18,
            oruPenalty: Number(convert.oruFromFarm) / 1e18,
            totalInOru: Number(convert.totalOru) / 1e18,
            totalInUsd: (Number(convert.totalOru) / 1e18)  * oruPrice
        })
    )
}

export async function contractLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const transfer = erc721.events["Transfer(address,address,uint256)"].decode(ctx);

  console.log("We are here!")
    console.log(transfer);

  let from = transfer.from;
  let to = transfer.to

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      from,
      to
    })
  );
}


export async function tvlIncLogsHandler(
    ctx: EvmLogHandlerContext
): Promise<void> {


    const tvlChartId = ctx.txHash;
    const pairAddress = ctx.contractAddress;
    const mint = pair.events["Mint(address indexed sender, uint amount0, uint amount1)"].decode(ctx);

    let amt0 = 1;
    let amt1 = 1;

    let price0 = 1;
    let price1 = 1;

    if (pairAddress === ORU_USDC_PAIR) {

        amt0 = Number(mint.amount0) / 1e6;
        amt1 = Number(mint.amount1) / 1e18;

        price0 = 1;
        price1 = amt0 / amt1;


        console.log("AMT0: " + mint.amount0.toString())
        console.log("AMT1: " + mint.amount1.toString())
        console.log("OUSD USDC PAIR price + " + price1)
        console.log("TVL: " + ((amt0 * price0) + (amt1 * price1)));

    }

    else if (pairAddress === OUSD_USDC_PAIR) {

        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e6;

        price0 = amt1 / amt0;
        price1 = 1;

        console.log("OUSD USDC PAIR price + " + price0)


    }

    else if (pairAddress === OUSD_ORU_PAIR) {

        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e18;

        price0 = 1; // ORU price ~0.08
        price1 = amt0 / amt1; // Theoriticall our stable coin costs 1

        console.log(`AMT0 ${amt0}`)
        console.log(`AMT1 ${amt1}`)
        console.log(`Theo TVL: ${(amt0 * price0) + (amt1 * price1)}`)



    }

    // FIXME: in Case of USDC

    let tvlValue = (amt0 * price0) + (amt1 * price1);

    const charts = await ctx.store.getRepository(TVLChart);
    const chartsLength =  await charts.count();

    if (chartsLength !== 0) {
        const lastChart = await charts.find({id: (chartsLength - 1).toString()});
        const newTvlValue = (tvlValue) +  (+(lastChart[0].value));
        const diffTime = Number(lastChart[0].endTimestamp) - Number(ctx.substrate.block.timestamp);


        console.log(`End time ${Number(lastChart[0].endTimestamp)}`)
        console.log(`Current time ${Number(ctx.substrate.block.timestamp)}`)
        console.log(diffTime);

        // 24h not pass updating last value
        if (diffTime > 0) {
            await ctx.store.save(
                new TVLChart({
                    id: lastChart[0].id,
                    currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                    endTimestamp: BigInt(lastChart[0].endTimestamp),
                    value: newTvlValue
                })
            )
        }

        // 24h pass creating new entry
        else {

            console.log("Creating new entry!");

            await ctx.store.save(
                new TVLChart({
                    id: (chartsLength).toString(),
                    currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                    endTimestamp: BigInt(Number(ctx.substrate.block.timestamp) + (21600 * 1000)) ,
                    value: newTvlValue
                })
            )
        }

    }
    else {
        await ctx.store.save(
            new TVLChart({
                id: (chartsLength).toString(),
                currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                endTimestamp: BigInt(ctx.substrate.block.timestamp + (21600 * 1000)),
                value: tvlValue
            })
        )
    }
}

export async function tvlDecLogsHandler(
    ctx: EvmLogHandlerContext
): Promise<void> {


    const tvlChartId = ctx.txHash;
    const pairAddress = ctx.contractAddress;
    const mint = pair.events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].decode(ctx);

    let amt0 = 1;
    let amt1 = 1;

    let price0 = 1;
    let price1 = 1;

    if (pairAddress === ORU_USDC_PAIR) {

        amt0 = Number(mint.amount0) / 1e6;
        amt1 = Number(mint.amount1) / 1e18;

        price0 = 1;
        price1 = amt0 / amt1;


        console.log("AMT0: " + mint.amount0.toString())
        console.log("AMT1: " + mint.amount1.toString())
        console.log("OUSD USDC PAIR price + " + price1)
        console.log("TVL: " + ((amt0 * price0) + (amt1 * price1)));

    }

    else if (pairAddress === OUSD_USDC_PAIR) {

        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e6;

        price0 = amt1 / amt0;
        price1 = 1;

        console.log("OUSD USDC PAIR price + " + price0)


    }

    else if (pairAddress === OUSD_ORU_PAIR) {

        amt0 = +(mint.amount0.toString()) / 1e18;
        amt1 = +(mint.amount1.toString()) / 1e18;

        price0 = 1;
        price1 = amt0 / amt1; // Theoriticall our stable coin costs 1

    }

    // FIXME: in Case of USDC

    let tvlValue = (amt0 * price0) + (amt1 * price1);

    const charts = await ctx.store.getRepository(TVLChart);
    const chartsLength =  await charts.count();

    const lastChart = await charts.find({id: (chartsLength - 1).toString()});
    const newTvlValue = (+(lastChart[0].value)) - (tvlValue);
    const diffTime = Number(lastChart[0].endTimestamp) - Number(ctx.substrate.block.timestamp);


    console.log(`End time ${Number(lastChart[0].endTimestamp)}`)
    console.log(`Current time ${Number(ctx.substrate.block.timestamp)}`)
    console.log(diffTime);

    // 24h not pass updating last value
    if (diffTime > 0) {
        await ctx.store.save(
            new TVLChart({
                id: lastChart[0].id,
                currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                endTimestamp: BigInt(lastChart[0].endTimestamp),
                value: newTvlValue
            })
        )
    }

    // 24h pass creating new entry
    else {

        console.log("Creating new entry!");

        await ctx.store.save(
            new TVLChart({
                id: (chartsLength).toString(),
                currentTimestamp: BigInt(ctx.substrate.block.timestamp),
                endTimestamp: BigInt(Number(ctx.substrate.block.timestamp) + (21600 * 1000)) ,
                value: newTvlValue
            })
        )
    }


}