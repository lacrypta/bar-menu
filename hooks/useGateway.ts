import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { splitSignature } from "@ethersproject/bytes";
import { ISignature } from "../types/crypto";

// struct TransferVoucher {
//     address from;
//     address to;
//     uint256 amount;
//     uint256 deadline;
//     //
//     uint256 fee;
//     uint256 nonce;
// }

// TYPEHASH
// execute(TransferVoucher{address,address,uint256,uint256,uint256,uint256})
const types = {
  Permit: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "deadline", type: "uint256" },

    { name: "fee", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
};

interface IRequestSignatureArgs {
  name: string;
  contract: string;
  spender: string;
  value: string;
  fee: number;
  deadline: number;
}

interface IUseGatewayResult {
  signature?: ISignature;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  requestSignature: (_args: IRequestSignatureArgs) => void;
}

const useGateway = (): IUseGatewayResult => {
  const { address: owner } = useAccount();

  const [signature, setSignature] = useState<ISignature>();

  const { data, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData();

  const requestSignature = async ({
    name,
    contract,
    spender,
    value,
    fee,
    deadline,
  }: IRequestSignatureArgs) => {
    const nonce =
      "0x0000000000000000000000000000000000000000000000000000000000000000"; // TODO: Look for nonce

    setSignature(undefined);

    signTypedData({
      domain: {
        name: name,
        version: "1",
        chainId: 137,
        verifyingContract: contract,
      },
      types,
      value: {
        from: owner?.toLocaleLowerCase(),
        to: spender,
        amount: value,
        deadline: deadline,
        fee,
        nonce,
      },
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      console.info("data:");
      console.dir(data);

      const { r, s, v } = splitSignature(data);
      console.info("setting signature");
      setSignature({ r, s, v });
    }
  }, [data, isLoading, isSuccess]);

  return { signature, isError, isLoading, isSuccess, requestSignature };
};

export default useGateway;
