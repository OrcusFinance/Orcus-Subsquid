import { ethers } from "ethers";
import ABI from "./abis/erc20.json";

export const CONTRACT_ADDRESS = "0xCdB32eEd99AA19D39e5d6EC45ba74dC4afeC549F".toLowerCase();

export const ORU_USDC_PAIR = "0x43783EcE7b46BB026D4CeBfd3e29f539Ff1914fB".toLowerCase();
export const OUSD_USDC_PAIR = "0xCf83a3d83c1265780d9374e8a7c838fE22BD3DC6".toLowerCase();
export const OUSD_ORU_PAIR = "0xE5A11AfBed6a0fC59e69493F7142ef7e454e809f".toLowerCase();
export const PROFIT_CONTROLLER = "0x17b6c54EF3d64FA100067e60Fd69878291C9e592".toLowerCase();

// API constants
export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
export const ARCHIVE =
  "http://localhost:4010";
export const BATCH_SIZE = 500;
export const API_RETRIES = 5;

// From contract
export const CONTRACT_NAME = "Orcus Token";
export const CONTRACT_SYMBOL = "ORU";
export const CONTRACT_TOTAL_SUPPLY = 1000n;

// ethers contract
export const PROVIDER = new ethers.providers.WebSocketProvider(CHAIN_NODE);
export const CONTRACT_INSTANCE = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  PROVIDER
);
