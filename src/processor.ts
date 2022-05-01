import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import {
    CHAIN_NODE,
    BATCH_SIZE,
    CONTRACT_ADDRESS,
    ORU_USDC_PAIR,
    OUSD_USDC_PAIR,
    OUSD_ORU_PAIR,
    PROFIT_CONTROLLER
} from "./constants";
import {contractLogsHandler, profitLogHanlder, tvlDecLogsHandler, tvlIncLogsHandler} from "./helpers/events";
import { events } from "./abis/uniswap-pair";
import {profitEvents} from "./abis/profit-controller";

const processor = new SubstrateEvmProcessor("astar-orcus");

processor.setBatchSize(BATCH_SIZE);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("astar")[0].url,
});

processor.setTypesBundle("astar");

// TVL add.
// oUSD/ORU pair
processor.addEvmLogHandler(
    OUSD_ORU_PAIR,
    {
        filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
        range: {from: 864889}
    },
    tvlIncLogsHandler
);

// ORU/USDC pair
processor.addEvmLogHandler(
    ORU_USDC_PAIR,
    {
        filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
        range: {from: 864889}
    },
    tvlIncLogsHandler
);

// OUSD/USDC_PAIR
processor.addEvmLogHandler(
    OUSD_USDC_PAIR,
    {
        filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
        range: {from: 864889}
    },
    tvlIncLogsHandler
);


// tvlDecLogsHandler

// oUSD/ORU pair
processor.addEvmLogHandler(
    OUSD_ORU_PAIR,
    {
        filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
        range: {from: 864889}
    },
    tvlDecLogsHandler
);


// OUSD/USDC
processor.addEvmLogHandler(
    OUSD_USDC_PAIR,
    {
        filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
        range: {from: 864889}
    },
    tvlDecLogsHandler
);


// ORU/USDC pair
processor.addEvmLogHandler(
    ORU_USDC_PAIR,
    {
        filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
        range: {from: 864889}
    },
    tvlDecLogsHandler
);


processor.addEvmLogHandler(
    PROFIT_CONTROLLER,
    {
        filter: [profitEvents["LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"].topic],
        range: {from: 864889}
    },
    profitLogHanlder
)

processor.run();
