import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./components/ui/button";
import { useProofs } from "./hooks/useProofs";

function App() {
  const { proofDrops } = useProofs();

  return (
    <div className="bg-secondary w-screen min-h-screen overflow-auto flex">
      <aside className="bg-black min-h-screen w-32"></aside>
      <div className=" p-8 ">
        <Card>
          <CardHeader>Proofs</CardHeader>
          <CardContent>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>

            <Button>Claim</Button>
          </CardContent>

          <CardFooter>Card Footer</CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
