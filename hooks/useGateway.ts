import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { splitSignature } from "@ethersproject/bytes";

import { useContract, useProvider, useSignMessage } from "wagmi";

import { ISignature, ITransferVoucher } from "../types/crypto";
import { encodeVoucher } from "../lib/public/utils";

import mockGatewayABI from "../abi/GatewayMock.json";

const TRANSFER_FROM_TAG =
  process.env.NEXT_PUBLIC_GATEWAY_TRANSFER_FROM_TAG || "";
interface IRequestSignatureArgs {
  from: string;
  to: string;
  amount: string;
  deadline: number;
  orderId: string;
}

interface IUseGatewayResult {
  signature?: ISignature;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  voucher?: ITransferVoucher;
  requestSignature: (_args: IRequestSignatureArgs) => void;
}

const MOCK_GATEWAY = "0x6d824682aA66da4e6738c6f3e16cC15fe9ce6F79";

const useGateway = (
  contractName: string,
  contractAddress: string,
  onSuccess?: (_args: any) => void
): IUseGatewayResult => {
  const [signature, setSignature] = useState<ISignature>();
  const [voucher, setVoucher] = useState<ITransferVoucher>();
  const [signatureMessage, setSignatureMessage] = useState<string>();

  const provider = useProvider();

  const gatewayContract = useContract({
    addressOrName: MOCK_GATEWAY,
    contractInterface: mockGatewayABI,
    signerOrProvider: provider,
  });

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    onSuccess,
  });

  const mockMessage = async (voucher: ITransferVoucher): Promise<string> => {
    let message = "👉👉👉  AUTORIZO EL PAGO  👈👈👈\n";
    message += "💲 Monto: " + formatUnits(voucher.payload.amount, 6) + " P\n";
    message += "#️⃣ Order: " + voucher.metadata + "\n";
    message += "🧑 Destino: " + voucher.payload.to + "\n";
    message += "\n";
    message += "🟰🟰🟰🟰🟰🟰🟰 DATA 🟰🟰🟰🟰🟰🟰🟰\n";
    message +=
      "3afs5df67sd6f75a7684ds67f87sa43afs5df67sd6f75a7684ds67f87sa43afs5df67sd6f75a7684ds67f87sa47f6a5s4dfas6574453sd4a5f34as6533sd546f3sd786f5a7s9d86fsa87df5a7";
    return message;
  };

  const getSignatureMessage = async (
    voucher: ITransferVoucher
  ): Promise<string> => {
    // const message = await gatewayContract.getMessage(encodeVoucher(voucher));
    const message = mockMessage(voucher); // TODO: Remove this
    return message;
  };

  const requestSignature = async ({
    from,
    to,
    amount,
    deadline,
    orderId,
  }: IRequestSignatureArgs) => {
    const nonce = ethers.BigNumber.from(
      ethers.utils.randomBytes(32)
    ).toHexString();

    setSignature(undefined);

    const _voucher: ITransferVoucher = {
      tag: TRANSFER_FROM_TAG,
      //
      nonce,
      deadline: String(deadline),
      payload: {
        from,
        to,
        amount: parseUnits(amount, 6).toString(),
      },
      //
      metadata: orderId,
    };

    setVoucher(_voucher);

    const _signatureMessage = await getSignatureMessage(_voucher);
    setSignatureMessage(_signatureMessage);

    signMessage({
      message: _signatureMessage,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      const { r, s, v } = splitSignature(data);
      setSignature({ r, s, v });
    }
  }, [data, isLoading, isSuccess]);

  return {
    voucher,
    signature,
    isError,
    isLoading,
    isSuccess,
    requestSignature,
  };
};

export default useGateway;