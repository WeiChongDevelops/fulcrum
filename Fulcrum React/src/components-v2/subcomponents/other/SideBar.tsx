import { Avatar, AvatarFallback, AvatarImage } from "@/components-v2/ui/avatar.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { EmailContext, LocationContext } from "@/utility/util.ts";
import { UserPreferences } from "@/utility/types.ts";
import { handleUserLogout } from "@/utility/api.ts";
import PageNavigationButton from "@/components-v2/subcomponents/other/PageNavigationButton.tsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SignOut } from "@phosphor-icons/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components-v2/ui/dropdown-menu";
import { cn } from "@/lib/utils.ts";
import { Switch } from "@/components-v2/ui/switch.tsx";
import ThemeToggle from "@/components-v2/subcomponents/other/ThemeToggle.tsx";

interface SideBarProps {
  userPreferences: UserPreferences;
  sideBarOpen: boolean;
  setSideBarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SideBar({ userPreferences, sideBarOpen, setSideBarOpen }: SideBarProps) {
  const routerLocation = useContext(LocationContext);
  const activeEmail = useContext(EmailContext);

  const [currentPage, setCurrentPage] = useState(window.location.pathname.split("/")[2]);

  useEffect(() => {
    setCurrentPage(window.location.pathname.split("/")[2]);
  }, [routerLocation]);

  const animatedMenuContainerRef = useRef<HTMLDivElement>(null);

  const toggleNavMenu = () => {
    if (!!animatedMenuContainerRef.current) {
      if (sideBarOpen) {
        animatedMenuContainerRef.current.style.width = "5rem";
      } else {
        animatedMenuContainerRef.current.style.width = "100%";
      }
    }
    setSideBarOpen(!sideBarOpen);
  };

  const [autoAnimateRef] = useAutoAnimate();
  const [signOutMenuOpen, setSignOutMenuOpen] = useState(false);

  return (
    <div
      className={`fixed flex flex-col ${sideBarOpen ? "w-[13rem]" : "w-[5rem]"} h-screen z-50 transition-all duration-400 ease-out`}
      ref={autoAnimateRef}
    >
      {/*<div className={"flex justify-start items-center h-[6vh] w-full bg-gray-700"}>*/}
      {/*  <img*/}
      {/*    src={`/static/assets-v2/fulcrum-logos/fulcrum-long-${userPreferences.darkModeEnabled ? "white" : "black"}.webp`}*/}
      {/*    className="w-32 ml-4"*/}
      {/*    onClick={() => (window.location.href = "/app/budget")}*/}
      {/*    alt="Fulcrum logo"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div className={"flex justify-start items-center h-[6vh] w-full bg-gray-700"}>*/}
      {/*  <img*/}
      {/*    src={`/static/assets-v2/fulcrum-logos/fulcrum-long-${userPreferences.darkModeEnabled ? "white" : "black"}.webp`}*/}
      {/*    className="w-32 ml-4"*/}
      {/*    onClick={() => (window.location.href = "/app/budget")}*/}
      {/*    alt="Fulcrum logo"*/}
      {/*  />*/}
      {/*</div>*/}
      <div
        ref={animatedMenuContainerRef}
        className={`flex flex-col justify-start items-center relative h-screen bg-[#1e3836] text-gray-300 overflow-hidden pl-3 pr-4 transition-all duration-600 ease-out"}`}
      >
        {sideBarOpen ? (
          <div className={"flex flex-row w-full justify-between items-center ml-4 mt-2.5"}>
            <img
              src={`/static/assets-v2/fulcrum-logos/fulcrum-logo-white-v2.webp`}
              className={cn(sideBarOpen ? "w-28" : "w-0")}
              onClick={() => (window.location.href = "/home/about")}
              alt="Fulcrum logo"
            />
            <Button variant={"ghost"} onClick={toggleNavMenu} className={"px-3 py-0"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
              </svg>
            </Button>
          </div>
        ) : (
          <div className={"flex justify-center items-center mt-2.5"}>
            <Button variant={"ghost"} onClick={toggleNavMenu} className={"px-3 py-0"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </Button>
          </div>
        )}
        <div className={"flex flex-row justify-start items-start w-full px-1 gap-3 text-left mt-6 min-h-12"}>
          <Avatar className={"size-9"}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <img src="/static/assets-v2/fulcrum-logos/fulcrum-icon.png" alt="Avatar fallback" className={"w-[65%]"} />
            </AvatarFallback>
          </Avatar>
          {sideBarOpen && (
            <div className={"flex flex-col justify-start flex-grow w-1/2 -mt-0.5"}>
              <div className={"flex flex-row items-center justify-between"}>
                <p className={"text-base font-semibold"}>Personal</p>

                <DropdownMenu open={signOutMenuOpen} onOpenChange={setSignOutMenuOpen}>
                  <DropdownMenuTrigger>
                    <SignOut
                      weight={"bold"}
                      className={cn("-scale-100 hover:text-red-500", signOutMenuOpen && "text-red-500")}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={"flex flex-col items-start"} side={"right"} sideOffset={20}>
                    <DropdownMenuItem className={"w-full hover:cursor-pointer here"} onSelect={handleUserLogout}>
                      <span className={"text-red-500 text-xs font-semibold"}>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className={"text-[0.65rem] truncate w-full mt-0.5"}>{activeEmail}</p>
            </div>
          )}
        </div>
        <div className={"flex flex-col justify-start mt-8 gap-4 text-sm select-none mb-4 h-full w-full"}>
          <PageNavigationButton
            page={"budget"}
            currentPage={currentPage}
            sideBarOpen={sideBarOpen}
            svgIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="size-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
              </svg>
            }
          />
          <PageNavigationButton
            page={"expenses"}
            currentPage={currentPage}
            sideBarOpen={sideBarOpen}
            svgIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
          />
          <PageNavigationButton
            page={"recurring"}
            currentPage={currentPage}
            sideBarOpen={sideBarOpen}
            svgIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            }
          />
          <PageNavigationButton
            page={"settings"}
            currentPage={currentPage}
            sideBarOpen={sideBarOpen}
            svgIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            }
          />
          <ThemeToggle userPreferences={userPreferences} sideBarOpen={sideBarOpen} className={"pl-4 h-12 mt-auto"} />
          <PageNavigationButton
            currentPage={currentPage}
            page={"help"}
            nonAppRedirectUrl={"/home/faq"}
            sideBarOpen={sideBarOpen}
            svgIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
