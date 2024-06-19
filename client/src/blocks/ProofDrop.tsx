import { client } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAccount as useStarknetAccount } from "@starknet-react/core";
import { solidityPackedKeccak256 } from "ethers";

import StarknetClaim from "../../../contracts/cairo/target/dev/cairo_ProofClaimContract.contract_class.json";
import { useMemo } from "react";

export const ProofDrop = () => {
  const { id } = useParams();

  const { address } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ["erc721"],
    queryFn: async () => {
      const res = await client.tokens.erc721.user.$get({
        query: {
          collection: id,
          user: address,
        },
      });
      return await res.json();
    },
  });

  return (
    <div>
      <div>Collection {id}</div>

      <div>Your Tokens to redeem</div>

      <div className="grid grid-cols-3 gap-3">
        {isLoading && <div>Loading...</div>}
        {!isLoading &&
          data?.tokens?.map((token, index) => {
            return (
              <Card key={index}>
                <CardContent>{token.token?.tokenId}</CardContent>

                <CardFooter>
                  {" "}
                  <ClaimButton tokenId={token.token?.tokenId!} />
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export const ClaimButton = ({ tokenId }: { tokenId: string }) => {
  const { address } = useAccount();
  const { address: StarknetAddress } = useStarknetAccount();
  const { chain } = useNetwork();

  const { contract } = useContract({
    abi: StarknetClaim.abi,
    address: chain.nativeCurrency.address,
  });

  const calls = useMemo(() => {
    // This is the slot where the token id is stored
    const tokenIdSlot = solidityPackedKeccak256(
      ["string", "uint256"],
      [tokenId, 2]
    );

    if (!address || !contract) return [];
    return contract.populateTransaction["claim"]!(
      BigInt(address),
      5963231,
      tokenIdSlot,
      1
    );
  }, [contract, address]);

  const {
    writeAsync,
    data: writeData,
    isPending,
  } = useContractWrite({
    calls,
  });
  return <Button onClick={() => writeAsync()}>Transfer</Button>;
};
