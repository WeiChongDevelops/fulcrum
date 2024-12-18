import { Switch } from "@/components-v2/ui/switch.tsx";
import { useContext, useEffect, useState } from "react";
import { UserPreferences } from "@/utility/types.ts";
import useUpdateUserPreferences from "@/hooks/mutations/other/useUpdateUserPreferences.ts";
import { cn, LocationContext, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ThemeToggleProps {
  hideDescriptor?: boolean;
  sideBarOpen?: boolean;
  className?: string;
  alwaysWhite?: boolean;
}

export default function ThemeToggle({
  sideBarOpen = true,
  hideDescriptor = false,
  className,
  alwaysWhite,
}: ThemeToggleProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [darkModeOn, setDarkModeOn] = useState(userPreferences.darkModeEnabled);
  const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  const routerLocation = useContext(LocationContext);

  const handleToggleChange = () => {
    setDarkModeOn(!darkModeOn);
    const updatedUserPreferences: UserPreferences = { ...userPreferences, darkModeEnabled: !darkModeOn };
    updateUserPreferences(updatedUserPreferences);
  };

  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    setDarkModeOn(userPreferences.darkModeEnabled);
  }, [userPreferences, routerLocation]);

  useEffect(() => {
    setRerenderKey(rerenderKey + 1);
  }, [darkModeOn]);

  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center gap-3.5 font-semibold text-white",
        className,
        alwaysWhite ? "text-white" : "text-primary",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        {darkModeOn ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        )}
      </svg>
      {sideBarOpen && (
        <div className={"flex flex-row items-center"}>
          {!hideDescriptor && <p className={"mr-4 text-[0.8rem]"}>Theme</p>}
          <Switch checked={darkModeOn} onCheckedChange={handleToggleChange} className={"shadow"} key={rerenderKey} />
        </div>
      )}
    </div>
  );
}
