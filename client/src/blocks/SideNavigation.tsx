import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SideNavigation = () => {
  const menu = [
    {
      name: "Home",
      icon: <Home className=" w-6" />,
      path: "/account",
    },
    {
      name: "Proofs",
      icon: <User className=" w-6" />,
      path: "/proofs",
    },
  ];

  return (
    <aside className="min-h-screen bg-primary-foreground w-18  p-1">
      <div className=" flex flex-col items-center gap-4 px-2 sm:py-4">
        {menu.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link to={item.path}>
                <Button variant={"default"}>
                  {" "}
                  {item.icon}
                  <span className="sr-only">{item.name}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </aside>
  );
};
