import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Connector, useConnect } from "wagmi";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function EthereumAccount() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <Button size={"sm"} variant={"destructive"} onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}

export const EthereumAccountConnectors = () => {
  const { connectors, connect } = useConnect();
  return connectors.map((connector) => (
    <Button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </Button>
  ));
};
