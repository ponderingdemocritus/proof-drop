import { Button } from "@/components/ui/button";
import { useConnect, useAccount } from "@starknet-react/core";

export function StarknetConnectors() {
  const { connect, connectors } = useConnect();
  return (
    <ul>
      {connectors.map((connector) => (
        <li key={connector.id}>
          <Button onClick={() => connect({ connector })}>
            {connector.name}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function StarknetAccount() {
  const { account, address, status } = useAccount();

  if (status === "disconnected") return <p>Disconnected</p>;
  return <p>Account: {address}</p>;
}
