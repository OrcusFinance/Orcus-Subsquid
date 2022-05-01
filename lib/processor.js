"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const substrate_evm_processor_1 = require("@subsquid/substrate-evm-processor");
const archive_registry_1 = require("@subsquid/archive-registry");
const constants_1 = require("./constants");
const events_1 = require("./helpers/events");
const profit_controller_1 = require("./abis/profit-controller");
const processor = new substrate_evm_processor_1.SubstrateEvmProcessor("astar-orcus");
processor.setBatchSize(constants_1.BATCH_SIZE);
processor.setDataSource({
    chain: constants_1.CHAIN_NODE,
    archive: (0, archive_registry_1.lookupArchive)("astar")[0].url,
});
processor.setTypesBundle("astar");
// processor.addEvmLogHandler(
//   CONTRACT_ADDRESS,
//   {
//     filter: [events["Transfer(address,address,uint256)"].topic],
//       range: {from: 864889}
//   },
//   contractLogsHandler
// );
// TVL add.
// oUSD/ORU pair
// processor.addEvmLogHandler(
//     OUSD_ORU_PAIR,
//     {
//         filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
//         range: {from: 864889}
//     },
//     tvlIncLogsHandler
// );
//
// // ORU/USDC pair
// processor.addEvmLogHandler(
//     ORU_USDC_PAIR,
//     {
//         filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
//         range: {from: 864889}
//     },
//     tvlIncLogsHandler
// );
//
// // OUSD/USDC_PAIR
// processor.addEvmLogHandler(
//     OUSD_USDC_PAIR,
//     {
//         filter: [events["Mint(address indexed sender, uint amount0, uint amount1)"].topic],
//         range: {from: 864889}
//     },
//     tvlIncLogsHandler
// );
//
//
// // tvlDecLogsHandler
//
// // oUSD/ORU pair
// processor.addEvmLogHandler(
//     OUSD_ORU_PAIR,
//     {
//         filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
//         range: {from: 864889}
//     },
//     tvlDecLogsHandler
// );
//
//
// // OUSD/USDC
// processor.addEvmLogHandler(
//     OUSD_USDC_PAIR,
//     {
//         filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
//         range: {from: 864889}
//     },
//     tvlDecLogsHandler
// );
//
//
// // ORU/USDC pair
// processor.addEvmLogHandler(
//     ORU_USDC_PAIR,
//     {
//         filter: [events["Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"].topic],
//         range: {from: 864889}
//     },
//     tvlDecLogsHandler
// );
processor.addEvmLogHandler(constants_1.PROFIT_CONTROLLER, {
    filter: [profit_controller_1.profitEvents["LogConvert(uint256 oruFromFarm, uint256 usdcFromArb, uint256 oruFromArb, uint256 ousdFromFee, uint256 usdcFromFee, uint256 oruFromFee, uint256 wastrFromInvest, uint256 usdcFromInvest, uint256 oruFromInvest, uint256 totalOru)"].topic],
    range: { from: 864889 }
}, events_1.profitLogHanlder);
processor.run();
//# sourceMappingURL=processor.js.map