import { Button } from "@/components-v2/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { capitaliseFirstLetter, cn, useEmail } from "@/utility/util.ts";
import { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserPreferences } from "@/utility/types.ts";

interface PageNavigationButtonProps {
  currentPage: string;
  page: string;
  svgIcon: ReactNode;
  nonAppRedirectUrl?: string;
  sideBarOpen: boolean;
  className?: string;
}

export default function PageNavigationButton({
  currentPage,
  page,
  svgIcon,
  nonAppRedirectUrl = "/app/register",
  sideBarOpen,
  className,
}: PageNavigationButtonProps) {
  const navigate = useNavigate();
  const isActive = currentPage === page;
  const isAppPage = ["budget", "expenses", "recurring", "settings"].includes(page);
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "flex flex-row justify-start items-center gap-3.5 py-6 font-semibold transition-all duration-200 ease-out outline-none text-white",
        isActive && userPreferences.darkModeEnabled && "bg-background hover:bg-primary-foreground",
        !isActive && "hover:bg-[#e6e6e6] hover:text-black",
        className,
      )}
      onClick={() => (isAppPage ? navigate(`/app/${page}`) : (window.location.href = nonAppRedirectUrl))}
    >
      {svgIcon}

      {sideBarOpen && <p className={"text-[0.8rem]"}>{capitaliseFirstLetter(page)}</p>}
    </Button>
  );
}
