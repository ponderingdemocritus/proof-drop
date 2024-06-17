import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  EthereumAccount,
  EthereumAccountConnectors,
} from "./Accounts/Ethereum";
import { StarknetAccount, StarknetConnectors } from "./Accounts/Starknet";

export const Account = () => {
  return (
    <div>
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
    </div>
  );
};
