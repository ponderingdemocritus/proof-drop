import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  EthereumAccount,
  EthereumAccountConnectors,
} from "./Accounts/Ethereum";
import { StarknetAccount, StarknetConnectors } from "./Accounts/Starknet";
import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/useUser";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { client } from "@/App";

import abi from "@/abi/ProofDropCore.json";
import { useAccount as useStaknetAccount } from "@starknet-react/core";
import { sepolia } from "wagmi/chains";
import { useMemo } from "react";

import { num, shortString } from "starknet";

const dropCoreAddress = import.meta.env.VITE_PROOF_DROP_CORE;

export const Account = () => {
  const { user, loading, error, mutation } = useUser();

  const { address } = useAccount();

  const { address: StarknetAddress } = useStaknetAccount();

  const { data: hash, writeContract } = useWriteContract();

  const { data } = useReadContract({
    abi: abi.abi,
    functionName: "getRegisteredStarknetAddress",
    address: dropCoreAddress,
    args: [address],
    chainId: sepolia.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>Ethereum</CardHeader>
        <CardContent>
          <EthereumAccount />
          <EthereumAccountConnectors />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Starknet</CardHeader>
        <CardContent>
          <StarknetAccount />
          <StarknetConnectors />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Proof Drop Account</CardHeader>

        <CardContent className="flex gap-4">
          {!loading ? (
            !user ? (
              <Button
                onClick={() => {
                  mutation.mutate({
                    address: address as any,
                  });
                }}
              >
                Create Account
              </Button>
            ) : (
              <div> Logged in</div>
            )
          ) : (
            <div>loading</div>
          )}

          {!data ? (
            <Button
              onClick={() => {
                writeContract({
                  abi: abi.abi,
                  address: dropCoreAddress,
                  functionName: "register",
                  args: [BigInt(StarknetAddress || "0")],
                });
              }}
            >
              Link networks
            </Button>
          ) : (
            <div>
              Proof Drop Mainnet Account:{" "}
              {shortString.splitLongString(num.toHexString(data.toString()))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
