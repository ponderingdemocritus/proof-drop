import { client } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

export const ProofDrop = () => {
  const { id } = useParams();

  const { address } = useAccount();

  const [userTokens, setUserTokens] = useState([] as any[]);

  const getUserTokens = async () => {
    const response = await client.tokens.erc721.user.$get({
      query: {
        collection: id,
        user: address,
      },
    });

    const data = await response.json();

    console.log(data.tokens);

    setUserTokens(data.response.tokens);
  };

  useEffect(() => {
    getUserTokens();
  }, []);

  return (
    <div>
      <div>Collection {id}</div>

      <div>Your Tokens to redeem</div>

      <div className="grid grid-cols-3 gap-3">
        {userTokens?.map((token, index) => {
          return (
            <Card key={index}>
              <CardContent>{token.token.tokenId}</CardContent>

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
