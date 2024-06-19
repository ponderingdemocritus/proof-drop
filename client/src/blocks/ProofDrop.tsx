import { client } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

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
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};
