import { Button } from "@/components-v2/ui/button.tsx";
import { UserPreferences } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import CurrencySelectorV2 from "@/components-v2/subcomponents/selectors/CurrencySelectorV2.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useEmail, useSideBarIsOpen } from "@/utility/util.ts";
import { ChatCircleDots, ChatCircleText } from "@phosphor-icons/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components-v2/ui/tooltip.tsx";

export default function RecurringExpensesHeaderV2() {
  const sideBarOpen = useSideBarIsOpen();
  return (
    <div
      className={`flex flex-row gap-4 justify-start items-center text-primary  bg-primary-foreground border-b-2 w-full ${sideBarOpen ? "w-[calc(100vw-13rem)]" : "w-[calc(100vw-5rem)]"} h-[6%]`}
    >
      <TooltipProvider>
        <Tooltip delayDuration={425}>
          <TooltipTrigger>
            <Button variant={"ghost"} className={"ml-6 px-2"} onClick={() => window.open("/home/contact", "_blank")}>
              <ChatCircleText size={"1.4rem"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={"bottom"} className={"ml-24"}>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className={"flex flex-row justify-center items-center gap-2 ml-auto mr-2"}>
        <p className={"mr-4 font-medium text-base"}>Recurring Expenses</p>
        <CurrencySelectorV2 className={"w-26 mx-0 outline-none border-none shadow-none"} />
        <TooltipProvider>
          <Tooltip delayDuration={425}>
            <TooltipTrigger>
              <Button variant={"ghost"} className={"px-2.5 mr-2"} onClick={() => window.open("/home/faq", "_blank")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={"bottom"} className={"ml-24"}>
              <p>Get Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
