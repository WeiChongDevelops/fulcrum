import { Avatar, AvatarFallback, AvatarImage } from "@/components-v2/ui/avatar.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { EmailContext, LocationContext } from "@/utility/util.ts";
import { PublicUserData } from "@/utility/types.ts";
import { handleUserLogout } from "@/utility/api.ts";

interface NavigationMenuV2Props {
  publicUserData: PublicUserData;
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

export default function NavigationMenuV2({ publicUserData, navMenuOpen, toggleNavMenu }: NavigationMenuV2Props) {
  const navigate = useNavigate();
  const routerLocation = useContext(LocationContext);
  const activeEmail = useContext(EmailContext);

  const budgetLinkRef = useRef<HTMLDivElement>(null);
  const expensesLinkRef = useRef<HTMLDivElement>(null);
  const recurringLinkRef = useRef<HTMLDivElement>(null);
  const settingsLinkRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(window.location.pathname.split("/")[2]);

  useEffect(() => {
    setCurrentPage(window.location.pathname.split("/")[2]);
  }, [routerLocation]);

  return (
    <div className={"fixed flex flex-col w-64 h-screen overflow-x-visible z-30"}>
      <div className={"flex justify-start items-center h-[6vh] w-full bg-gray-400"}>
        <img
          src={`/static/assets-v2/fulcrum-logos/fulcrum-long-${publicUserData.darkModeEnabled ? "white" : "black"}.webp`}
          className="w-36 ml-6"
          onClick={() => (window.location.href = "/app/budget")}
          alt="Fulcrum logo"
        />
      </div>
      <div className={"flex flex-row"}>
        <div
          className={`flex flex-col relative h-[94vh]
    bg-gray-800 text-gray-300 overflow-hidden
     transition-all duration-200 ease-out ${navMenuOpen ? "w-full" : "w-2"}`}
        >
          <div className={"flex flex-row justify-start gap-3 items-start text-left m-4"}>
            <Avatar className={"size-8"}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                <img src="/static/assets-v2/fulcrum-logos/fulcrum-icon.png" alt="Avatar fallback" className={"w-[65%]"} />
              </AvatarFallback>
            </Avatar>
            <div className={"flex flex-col flex-grow w-1/2"}>
              <div className={"flex flex-row justify-between"}>
                <p className={"text-lg font-bold"}>Personal</p>
                <Button onClick={toggleNavMenu}>{"<<"}</Button>
              </div>
              <p className={"text-xs font-medium truncate w-full mb-3"}>{activeEmail}</p>
              <Button onClick={handleUserLogout}>Log Out</Button>
            </div>
          </div>
          <div className={"flex flex-col justify-start mt-8 gap-4 text-base select-none m-4"}>
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
          <Button className={"mt-auto mb-2 mx-4"}>Help</Button>
        </div>
        {!navMenuOpen && (
          <Button onClick={toggleNavMenu} className={"-ml-1.5 z-20 size-8 rounded-full"}>
            {">>"}
          </Button>
        )}
      </div>
    </div>
  );
}
