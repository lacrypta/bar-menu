import { ITransferVoucher } from "./../../plugins/gateway/types/Voucher";
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";

import {
  address,
  abi,
} from "@lacrypta/bar-gateway/deployments/matic/BarGateway.json";
import { ISignature } from "../../plugins/gateway/types/Signature";
import { BarGateway } from "@lacrypta/bar-gateway/typechain/BarGateway";
// import {} from "@lacrypta/bar-gateway/";

// contract details
const RPC_ADDRESS = process.env.NEXT_PUBLIC_RPC_ADDRESS || "";
const GATEWAY_ADDRESS = process.env.NEXT_PUBLIC_GATEWAY_CONTRACT || address;
const CALLER_PRIVATE_KEY = process.env.CALLER_PRIVATE_KEY || "";

const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS);
const signer = new ethers.Wallet(CALLER_PRIVATE_KEY, provider);

// Bar Contract
const contract = new BarGateway(GATEWAY_ADDRESS, abi, signer);

const transferAbi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
];

export async function getTx(txHash: string) {
  return provider.getTransaction(txHash);
}

export async function getTxReceipt(txHash: string) {
  const receipt = provider.getTransactionReceipt(txHash);
  return receipt;
}

export async function getTransferEvent(txHash: string) {
  const receipt = await getTxReceipt(txHash);
  const iface = new Interface(transferAbi);
  const event = receipt.logs[0];
  const { from, to, value } = iface.decodeEventLog(
    "Transfer",
    event.data,
    event.topics
  );

  return { raw: event, decoded: { from, to, value } };
}

export async function serveVoucher(
  voucher: ITransferVoucher,
  signature: ISignature
): Promise<string> {
  const { r, s, v } = signature;
  // contract["serveVoucher((uint32,uint256,uint256,bytes,bytes),bytes)"](voucher, signature.r);
  const tx = contract[
    "serveVoucher((uint32,uint256,uint256,bytes,bytes),bytes32,bytes32,uint8)"
  ](voucher, r, s, v);

  console.info("Broadcasting tx...");
  console.dir(await tx);
  return (await tx).hash;
}