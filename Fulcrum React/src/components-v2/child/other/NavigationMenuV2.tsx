import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { LocationContext } from "@/utility/util.ts";

interface NavigationMenuV2Props {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

export default function NavigationMenuV2({ navMenuOpen, toggleNavMenu }: NavigationMenuV2Props) {
  const navigate = useNavigate();
  const routerLocation = useContext(LocationContext);

  const budgetLinkRef = useRef<HTMLDivElement>(null);
  const expensesLinkRef = useRef<HTMLDivElement>(null);
  const recurringLinkRef = useRef<HTMLDivElement>(null);
  const settingsLinkRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(window.location.pathname.split("/")[2]);

  useEffect(() => {
    setCurrentPage(window.location.pathname.split("/")[2]);
  }, [routerLocation]);

  return (
    <div
      className={`flex flex-col h-screen
    bg-orange-500
    overflow-hidden
     transition-all duration-200 ease-out ${navMenuOpen ? "w-[18vw] p-4" : "p-0 w-0"}`}
    >
      <div className={"flex flex-row justify-start gap-3 items-center text-left"}>
        <Avatar className={"size-8"}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={"flex flex-col flex-grow w-1/2"}>
          <div className={"flex flex-row justify-between"}>
            <p className={"text-lg font-bold"}>Personal</p>
            <Button onClick={toggleNavMenu}>{"<<"}</Button>
          </div>
          <p className={"text-xs font-medium truncate w-full"}>example@fulcrum.com</p>
        </div>
      </div>
      <div className={"flex flex-col justify-start mt-12 gap-5 text-base select-none"}>
        <div
          ref={budgetLinkRef}
          className={`flex flex-row justify-start items-center gap-3 hover:cursor-pointer ${currentPage === "budget" ? "font-bold underline" : "font-medium"}`}
          onClick={() => navigate("/app/budget")}
        >
          <img src="https://github.com/shadcn.png" alt="Navigate to Budget" className={"size-8"} />
          <p>Budget</p>
        </div>
        <div
          ref={expensesLinkRef}
          className={`flex flex-row justify-start items-center gap-3 hover:cursor-pointer ${currentPage === "expenses" ? "font-bold underline" : "font-medium"}`}
          onClick={() => navigate("/app/expenses")}
        >
          <img src="https://github.com/shadcn.png" alt="Navigate to Expenses" className={"size-8"} />
          <p>Expenses</p>
        </div>
        <div
          ref={recurringLinkRef}
          className={`flex flex-row justify-start items-center gap-3 hover:cursor-pointer ${currentPage === "recurring" ? "font-bold underline" : "font-medium"}`}
          onClick={() => navigate("/app/recurring")}
        >
          <img src="https://github.com/shadcn.png" alt="Navigate to Recurring Expenses" className={"size-8"} />
          <p>Recurring</p>
        </div>
        <div
          ref={settingsLinkRef}
          className={`flex flex-row justify-start items-center gap-3 hover:cursor-pointer ${currentPage === "settings" ? "font-bold underline" : "font-medium"}`}
          onClick={() => navigate("/app/settings")}
        >
          <img src="https://github.com/shadcn.png" alt="Navigate to Settings" className={"size-8"} />
          <p>Settings</p>
        </div>
      </div>
      <Button className={"mt-auto"}>Help</Button>
    </div>
  );
}
