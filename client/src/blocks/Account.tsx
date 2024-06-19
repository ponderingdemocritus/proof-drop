import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  EthereumAccount,
  EthereumAccountConnectors,
} from "./Accounts/Ethereum";
import { StarknetAccount, StarknetConnectors } from "./Accounts/Starknet";
import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { client } from "@/App";

export const Account = () => {
  const { user, loading, error } = useUser();

  const { address } = useAccount();

  console.log(user);
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

        <CardContent>
          {!loading ? (
            !user ? (
              <Button
                onClick={async () => {
                  await client.users.create.$post({
                    json: {
                      address: address as any,
                    },
                  });
                }}
              >
                Create Account
              </Button>
            ) : (
              "Logged in"
            )
          ) : (
            "loading"
          )}
        </CardContent>
      </Card>
    </div>
  );
};
