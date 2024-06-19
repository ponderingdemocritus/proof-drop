import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useProofs } from "@/hooks/useProofs";
import { Link } from "react-router-dom";

export const Proofs = () => {
  const { proofDrops } = useProofs();

  return (
    <div>
      <div>All Proof drops</div>

      <div className="grid grid-cols-4">
        {proofDrops?.map((drop, index) => {
          return (
            <Card key={index}>
              <CardHeader>{drop.name}</CardHeader>
              <CardContent>
                <Link to={`/drops/${drop.contractAddress}`}>
                  <Button>Drop</Button>
                </Link>
              </CardContent>

              <CardFooter>{drop.destinationChainId}</CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
