import { Button } from "@/components-v2/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { capitaliseFirstLetter } from "@/utility/util.ts";
import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

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
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        `flex flex-row justify-start items-center gap-3 hover:cursor-pointer py-6 font-bold transition-all duration-200 ease-out text-white ${!isActive && "hover:bg-white hover:text-black"} ${className}`,
      )}
      onClick={() => (isAppPage ? navigate(`/app/${page}`) : (window.location.href = nonAppRedirectUrl))}
    >
      {svgIcon}

      {sideBarOpen && <p className={"text-[0.8rem]"}>{capitaliseFirstLetter(page)}</p>}
    </Button>
  );
}
